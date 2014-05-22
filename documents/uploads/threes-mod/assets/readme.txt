This is an example asset file for a project "twos-mod".
This whole twos-mod is an examle of what a project folder looks like on the backend.

The path to this project folder is: domain/uploads/twos-mod

The folders created when the project is created is as follows:

/			- root folder, available to the public
/release	- old versions of the project, available to the public
/builds		- new versions of the project, only available to logged in contributors
/assets 	- addition files like documents to support project, available to the public
/images		- images for project, available to the public

When a changelog is created a project file must be upoaded with it.
If the user chooses the "release" option the following happens:
	1. The project file is replaced(domain/uploads/twos-mod/latest.zip)
	2. A release repo file is created(domain/uploads/release/twos-mod-#.#.#.zip)
If the user chooses the "build" option the following happens
	1. A build repo file is created(domain/uploads/builds/twos-mod-#.#.#.zip)

All other files uploaded to the project are not version controlled through scripting.
These uploads need to be done outside a changelog event
The project owner(only) has privillages to create new directories within the assets/ and images/ folders.


