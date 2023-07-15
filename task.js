const fs = require('fs');
const args = process.argv.slice(2);

let usage = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;

if (args[0]=="help" || args[0]==null){
console.log(usage);
}

if (args[0]=="add"){
    
    const priority = args[1];
    const task = args[2];
    if(task ==  null){
        console.log("Error: Missing tasks string. Nothing added!");
    }
    const content = "Added task: \""+task+"\" with priority "+ priority;
    const data = priority+" "+task;
    fs.writeFile('task.txt', data, (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log('Task added successfully!');
        }
      });

    console.log(content);
}



