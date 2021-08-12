import joplin from 'api';
import { MenuItemLocation } from 'api/types';

joplin.plugins.register({
	onStart: async function() {

		await joplin.commands.register({
			name: 'rightClicktoNote',
			label: 'Convert Text to New Note',
			execute: async () => {

				//Get highlighted/selected text
				const selectedText = (await joplin.commands.execute('selectedText') as string);

				//Get current note ID  in order to get current notebook/folder ID, to put the new note in
				const note = await joplin.workspace.selectedNote();

				//Get current notebook/folder ID, to put the new note in
				const folder = await joplin.data.get(['folders', note.parent_id]);

				//Create new note with highlighted/selected text as title, note created in the same folder.
				//Return new note info, especially new note ID, to create link to new note.
				const newnote = await joplin.data.post(['notes'], null, { title: selectedText, parent_id: folder.id });
				
				//Replace highlighted/selected text with link to new note (1. Bracket original highlighted/selected text 2. Add hyperlink with new note ID)
				await joplin.commands.execute('replaceSelection',  `[${selectedText}](:/${newnote.id})`);
			},
		});
		//Add right-click context menu item
		await joplin.views.menuItems.create('contextMenuItem1', 'rightClicktoNote', MenuItemLocation.EditorContextMenu);
	},
});