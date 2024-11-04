import boxen from 'boxen';

const languageMap: Record<string, string> = {
	js: 'JavaScript',
};

const codeBlockRegex = /```(\w+)?\n([\s\S]*?)\n```/g;

export function printMessage(text: string) {
	const result = text.replace(codeBlockRegex, (_, language, code) => {
		const title = languageMap[language] || language;
		return boxen(code, {
			borderStyle: 'round',
			dimBorder: true,
			padding: { top: 1, right: 2, bottom: 1, left: 2 },
			title,
		});
	});
	console.log(boxen(result, {
		borderStyle: 'none',
		padding: { left: 4 },
	}));
}
