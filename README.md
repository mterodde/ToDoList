# Installation instructions

1. clone the repository into a local folder;
2. get node installed
3. install mongodb
4. start the mongodb server on its&#39; default port 27017
5. run „npm install&quot; within your project directory
6. run „npm run-script buid&quot;
7. go to the „server&quot; sub directory
8. run „node server.js&quot;

After this is done, the application can be accesses via localhost:3200

# How to use

The application allows any new user to register herself.

Authenticated users will be able to:

a) create new tasks<br>
b) mark a task as started / finished<br>
c) delete any task<br>
<br>
All the user tasks are displayed as a list.

# Current state of the implementation

- The basic features for user authentication are ready to be used.
- The business logic for handling and persisting the task list ere fully implemented but not end-to-end tested.
- The UI needs the components for task list manipulation added
