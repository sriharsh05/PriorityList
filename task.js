const fs = require('fs');
const args = process.argv.slice(2);

const taskFile = `${process.cwd()}/task.txt`;
const completedFile = `${process.cwd()}/completed.txt`;

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
 
  // If the file is not present in the directory
  if (!fs.existsSync(taskFile)) {
    const updatedContent = priority + ' ' + task;
    fs.writeFileSync(taskFile, updatedContent, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } 
    });
  } 
  else {
  const tasks = fs
    .readFileSync(taskFile, "utf8")
    .trim()
    .split("\n")
    .map((line) => line.split(" "))
    .map(([priority, ...parts]) => ({
      priority: parseInt(priority),
      task: parts.join(" "),
    }))

  // If the file is present and not empty  
  if (tasks[0].task != '') {
    tasks.push({ priority: parseInt(priority), task: task });
    const updatedContent = tasks
        .sort((a, b) => a.priority - b.priority)
        .map((item) => item.priority + ' ' + item.task)
        .join('\n'); 
        fs.writeFileSync(taskFile, updatedContent, (err) => {
          if (err) {
            console.error('Error writing to file:', err);
          }
   });    
  }
  // If the file is present and empty 
  else {
        const updatedContent = priority + ' ' + task;
        fs.writeFileSync(taskFile, updatedContent, (err) => {
          if (err) {
            console.error('Error writing to file:', err);
          } 
    });
  }
} 
  console.log(content);    
}

// Listing tasks
if (args[0]=='ls'){
  if (!fs.existsSync(taskFile)) {
    console.log("There are no pending tasks!");
  }
  else{
    const tasks = fs
    .readFileSync(taskFile, "utf8")
    .trim()
    .split("\n")
    .map((line) => line.split(" "))
    .map(([priority, ...parts]) => ({
      priority: parseInt(priority),
      task: parts.join(" "),
    }));
    if (tasks[0].task == ''){
      console.log("There are no pending tasks!");
    }
    else{
      tasks.forEach((task, idx) => {
        const taskLine = `${idx + 1}. ${task.task} [${task.priority}]`;
        console.log(taskLine);
    });
    } 
  }
}
