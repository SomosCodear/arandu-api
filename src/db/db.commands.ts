import * as path from 'path';
import { promises as fs } from 'fs';
import { Injectable } from '@nestjs/common';
import { Console, Command, createSpinner } from 'nestjs-console';
import { Connection } from 'typeorm';

@Console({
  name: 'db',
  description: 'Interacts with the database 🤘',
})
@Injectable()
export class DBCommands {
  constructor(private connection: Connection) {}
  @Command({
    command: 'sync',
    description: 'Synchronizes the entities with the tables',
  })
  async syncTables() {
    const spinner = createSpinner();
    spinner.start('Synchronizing the entities...');
    await this.connection.synchronize();
    spinner.succeed('Entities succesfully synchronized 😆');
    console.log(`
    ..oo$00ooo..                    ..ooo00$oo..
    .o$$$$$$$$$'                          '$$$$$$$$$o.
 .o$$$$$$$$$"             .   .              "$$$$$$$$$o.
.o$$$$$$$$$$~             /$   $\              ~$$$$$$$$$$o.
.{$$$$$$$$$$$.              $\___/$               .$$$$$$$$$$$}.
o$$$$$$$$$$$$8              .$$$$$$$.               8$$$$$$$$$$$$o
$$$$$$$$$$$$$$$              $$$$$$$$$               $$$$$$$$$$$$$$$
o$$$$$$$$$$$$$$$.             o$$$$$$$o              .$$$$$$$$$$$$$$$o
$$$$$$$$$$$$$$$$$.           o{$$$$$$$}o            .$$$$$$$$$$$$$$$$$
^$$$$$$$$$$$$$$$$$$.         J$$$$$$$$$$$L          .$$$$$$$$$$$$$$$$$$^
!$$$$$$$$$$$$$$$$$$$$oo..oo$$$$$$$$$$$$$$$$$oo..oo$$$$$$$$$$$$$$$$$$$$$!
{$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$}
6$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$?
'$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$'
o$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$o
$$$$$$$$$$$$$$;'~'^Y$$$7^''o$$$$$$$$$$$o''^Y$$$7^'~';$$$$$$$$$$$$$$$
'$$$$$$$$$$$'       '$'    ''$$$$$$$$$'     '$'       '$$$$$$$$$$$$'
!$$$$$$$$$7         !       '$$$$$$$'       !         V$$$$$$$$$!
^o$$$$$$!                   '$$$$$'                   !$$$$$$o^
^$$$$$"                    $$$$$                    "$$$$$^
 'o$$$'                   ^$$$'                   '$$$o'
   ~$$$.                   $$$.                  .$$$~
     '$;.                  '$'                  .;$'
        '.                  !                  .'
    `);
  }
  @Command({
    command: 'seed',
    description: 'Seeds the database with dummy data',
  })
  async seedTables(): Promise<void> {
    const spin = createSpinner();
    spin.start('Seeding database');
    const seedPath = path.join(__dirname, 'seeds');
    const files = await fs.readdir(seedPath);
    const seeds = files
      .filter((file) => file.match(/^\d+-[\w-]+\.json/))
      .sort()
      .reduce((acc, file) => {
        const [, entity] = /^\d+-([\w-]+)\./.exec(file);
        return [
          ...acc,
          {
            entity,
            filepath: path.join(seedPath, file),
          },
        ];
      }, []);

    const entities = await seeds.reduce(
      (acc, seed) =>
        acc.then(async (list) => {
          const entityMetadata = this.connection.entityMetadatas.find(
            (meta) => meta.tableName === seed.entity,
          );

          if (!entityMetadata) return list;
          const rows = JSON.parse(await fs.readFile(seed.filepath, 'utf-8'));
          await Promise.all(
            rows.map((row) =>
              this.connection
                .createQueryBuilder()
                .insert()
                .into(seed.entity)
                .values(row)
                .onConflict(`("id") DO NOTHING`)
                .execute(),
            ),
          );

          return [...list, seed.entity];
        }),
      Promise.resolve([]),
    );

    spin.succeed(`The following tables were successfully seeded: ${entities}.`);
  }
}
