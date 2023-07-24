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

// Deleting tasks from list
if (args[0]=='del'){
  const index = args[1];
  if (index == null){
    console.log("Error: Missing NUMBER for deleting tasks.");
  }
  if (!fs.existsSync(taskFile)) {
    console.log("Error: task with index #"+index+" does not exist. Nothing deleted.");
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
    }));
    
    if(index <=0 || index > tasks.length || tasks[0].task == ''){
      console.log("Error: task with index #"+index+" does not exist. Nothing deleted.");
    }
    else {
    tasks.splice(index-1,1)[0];
    const updatedContent = tasks
        .map((item) => item.priority + ' ' + item.task)
        .join('\n'); 
        fs.writeFileSync(taskFile, updatedContent, (err) => {
          if (err) {
            console.error('Error writing to file:', err);
          }
   });
    console.log("Deleted task #"+index);
    }
  }
}

// Marking as done
if (args[0]=='done'){
  const index = args[1];
  if (index == null){
    console.log("Error: Missing NUMBER for marking tasks as done.");
  }
  else{
    if (!fs.existsSync(taskFile)) {
      console.log("Error: no incomplete item with index #"+index+" exists.");
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
      }));
      if(index <=0 || index > tasks.length || tasks[0].task == ''){
        console.log("Error: no incomplete item with index #"+index+" exists.");
      }
      else{
        const completedtask = tasks.splice(index-1,1)[0].task;
        const updatedContent = tasks.map((item) => item.priority + ' ' + item.task).join('\n'); 
        fs.writeFileSync(taskFile, updatedContent, (err) => {
            if (err) {
              console.error('Error writing to file:', err);
            }
        });

        if (!fs.existsSync(completedFile)) {
          fs.writeFileSync(completedFile, completedtask + "\n", (err) => {
            if (err) {
              console.error('Error writing to file:', err);
            }
          });
        }
        else {
          fs.appendFileSync(completedFile, completedtask + "\n", (err) => {
            if (err) {
              console.error('Error writing to file:', err);
            }
          });
        }
        console.log("Marked item as done.");
      }
  }
} 
}

if (args[0]=='report'){
  const tasks = fs
      .readFileSync(taskFile, "utf8")
      .trim()
      .split("\n")
      .map((line) => line.split(" "))
      .map(([priority, ...parts]) => ({
        priority: parseInt(priority),
        task: parts.join(" "),
      }));
   console.log(`Pending : ${tasks.length}`);
    tasks.forEach((task, idx) => {
    const taskLine = `${idx + 1}. ${task.task} [${task.priority}]`;
    console.log(taskLine);
    });

    const completed = fs
    .readFileSync(completedFile, "utf8")
    .trim()
    .split("\n")
    
    console.log(`\n\Completed : ${completed.length}`);
    completed.forEach((task, idx) => {
      const taskLine = `${idx + 1}. ${task}`;
      console.log(taskLine);
      });
}