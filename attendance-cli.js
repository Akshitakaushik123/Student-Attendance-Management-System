
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

yargs(hideBin(process.argv))
    .command(
        'mark',
        'Mark attendance using command line',
        {
            roll: {
                describe: 'Student roll number',
                demandOption: true,
                type: 'string'
            },
            subject: {
                describe: 'Subject name',
                demandOption: true,
                type: 'string'
            },
            status: {
                describe: 'Attendance status',
                demandOption: true,
                choices: ['Present', 'Absent']
            }
        },
        (args) => {
            const log = `Roll: ${args.roll}, Subject: ${args.subject}, Status: ${args.status}, Date: ${new Date().toLocaleString()}\n`;

            fs.appendFileSync('attendance.txt', log);

            console.log('Attendance log added successfully!');
        }
    )
    .command(
        'view',
        'View attendance logs',
        {},
        () => {
            if (fs.existsSync('attendance.txt')) {
                console.log(fs.readFileSync('attendance.txt', 'utf8'));
            } else {
                console.log('No attendance logs found.');
            }
        }
    )
    .demandCommand(1, 'Please enter a command')
    .help()
    .parse();
