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

// Adding task
if (args[0] === 'add') {
  const priority = args[1];
  const task = args[2];
  const content = "Added task: \"" + task + "\" with priority " + priority;

   if (task == null) {
    console.log("Error: Missing tasks string. Nothing added!");
    return;
  }

  fs.writeFile('task.txt', '', 'utf8', (err) => {
    if (err) {
      console.error('Error creating file:', err);
    } 
  });

  const tasks = fs
    .readFileSync('task.txt', "utf8")
    .trim()
    .split("\n")
    .map((line) => line.split(" "))
    .map(([priority, ...parts]) => ({
      priority: parseInt(priority),
      task: parts.join(" "),
    }))

  if (tasks[0].task != '') {
    tasks.push({ priority: parseInt(priority), task: task });
    const updatedContent = tasks
        .sort((a, b) => a.priority - b.priority)
        .map((item) => item.priority + ' ' + item.task)
        .join('\n'); 
        fs.writeFile('task.txt', updatedContent, (err) => {
          if (err) {
            console.error('Error writing to file:', err);
          }
 });    
  }
  else {
    const updatedContent = priority + ' ' + task;
    fs.writeFile('task.txt', updatedContent, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } 
});
  }
  console.log(content);    
}
