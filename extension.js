const path = require('path');
const vscode = require('vscode');

function activate(context) {
	let insertRelativePath = vscode.commands.registerCommand('relative-from-current.insertRelativePath', function (event) {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			let relativeFileName = path.relative(path.dirname(document.fileName), event.path);
			if (!relativeFileName.startsWith('.')) {
				relativeFileName = './' + relativeFileName;
			}

			editor.edit(editBuilder => {
				editor.selections.forEach(selection => {
					const range = selection.isEmpty ? document.getWordRangeAtPosition(selection.start) || selection : selection;
					editBuilder.replace(range, relativeFileName);
				})
			})
		}
	});

	let copyRelativePath = vscode.commands.registerCommand('relative-from-current.copyRelativePath', function (event) {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			let relativeFileName = path.relative(path.dirname(document.fileName), event.path);
			if (!relativeFileName.startsWith('.')) {
				relativeFileName = './' + relativeFileName;
			}

			return vscode.env.clipboard.writeText(relativeFileName);
		}
	});

	context.subscriptions.push(copyRelativePath);
	context.subscriptions.push(insertRelativePath);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
