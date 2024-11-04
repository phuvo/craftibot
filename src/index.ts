import { program } from 'commander';

program
	.requiredOption('-p, --port <number>', 'Minecraft server port')
	.parse();

async function main() {
	const options = program.opts();
	console.log(options);
}

main().catch(console.error);
