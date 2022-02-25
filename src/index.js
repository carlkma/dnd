import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Read original, random list of blocks
const data = require('./test-random.json');
const lines = data.lines;

// To assign unique ID to every block
var id_count = 0;

// Array to store blocks by lines (rows)
var simplified_lines = [];

// Looping through blocks for preprocessing
for(var i = 0; i < lines.length; i++) {
    var temp_line = [];
    for(var j = 0; j < lines[i].tokens.length; j++) {
      lines[i].tokens[j].id='item-'+id_count;
      id_count++;
      temp_line.push(lines[i].tokens[j])
    }
    simplified_lines.push(temp_line);
}

// Helper Function: Reordering - Directly Adapted from Sources
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};


// Helper Function: Moving - Directly Adapted from Sources
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);
  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  // Note that result is an array of the modified line of blocks
  return result;
};


// Styling - Directly Adapted from Sources
const grid = 5;
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle
});

const getListStyle = (isDraggingOver, isEmpty) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  padding: grid,
  overflow: "auto",
  minHeight: isEmpty ? "45px" : "NaN"
});

// Main
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      row0: simplified_lines[0],
      row1: simplified_lines[1],
      row2: simplified_lines[2],
      row3: simplified_lines[3]
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  // Note the manual scripting of four rows
  // In the case of many more lines, could utlize for-loops to dynamically assign rows
  id2List = {
    droppable0: "row0",
    droppable1: "row1",
    droppable2: "row2",
    droppable3: "row3"
  };

  getList = id => this.state[this.id2List[id]];

  onDragEnd = result => {
    const { source, destination } = result;

    // Drag and Drop Implementation - Directly Adapted from Sources
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      
      const row0 = reorder(
        this.getList(source.droppableId),
        
        source.index,
        destination.index
      );

      let state = { row0 };

      if (source.droppableId === "droppable1") {
        state = { row1: row0 };
      }

      if (source.droppableId === "droppable2") {
        state = { row2: row0 };
      }

      if (source.droppableId === "droppable3") {
        state = { row3: row0 };
      }

      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );
      if (result.droppable0) {
        this.setState({ row0: result.droppable0 });
      }
      if (result.droppable1) {
        this.setState({ row1: result.droppable1 });
      }
      if (result.droppable2) {
        this.setState({ row2: result.droppable2 });
      }
      if (result.droppable3) {
        this.setState({ row3: result.droppable3 });
      }
    }

  };

// Rendering
  render() {

    // Four droppable locations

    var to_return = <DragDropContext onDragEnd={this.onDragEnd}>
        
        <Droppable droppableId="droppable0" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.row0.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.text.indexOf('input')==-1 // Display input box for certain blocks
                        ? item.text // Dealing with embedded input boxes
                        : <div> {item.text.substring(0,item.text.indexOf('input')-1)} <input></input> {item.text.substring(item.text.indexOf('input')+6)} </div>
                      }
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="droppable1" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.row1.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      
                      {item.text.indexOf('input')==-1
                        ? item.text
                        : <div> {item.text.substring(0,item.text.indexOf('input')-1)} <input></input> {item.text.substring(item.text.indexOf('input')+6)} </div>
                      }
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="droppable2" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver, true)}
            >
              {this.state.row2.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.text.indexOf('input')==-1
                        ? item.text
                        : <div> {item.text.substring(0,item.text.indexOf('input')-1)} <input></input> {item.text.substring(item.text.indexOf('input')+6)} </div>
                      }
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="droppable3" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver, true)}
            >
              {this.state.row3.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.text.indexOf('input')==-1
                        ? item.text
                        : <div> {item.text.substring(0,item.text.indexOf('input')-1)} <input></input> {item.text.substring(item.text.indexOf('input')+6)} </div>
                      }
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <button onClick={() => getJSON(this.state)}>
  Export JSON
</button>
      </DragDropContext>
      ;
    return (to_return);
  }
}

// Export to JSON the current state (order, line number, etc.) of blocks
function getJSON(state) {
  var output_list = [];
  var output_json = [];
  
  for (var i=0 ; i<simplified_lines.length; i++){
    
    var row_number = 'row' + i;
    var new_row = state[row_number];
    // Does not store indentation as a block, but rather a separate number
    var ind = 0;
    while (new_row.length > 0 && new_row[0].text=='···'){
      ind ++;
      new_row.shift();
    }
    // After storing indentation as a number, delete the indentation block
    for (var j=0; j<new_row.length; j++){
      delete new_row[j].id;
    }
    
    output_list.push({indentations:ind, tokens:new_row});
    
  }
  output_json = {lines:output_list}
  console.log(JSON.stringify(output_json));


// Storing the exported JSON data to a file for Download - Directly Adapted from Sources
const filename = 'data.json';
const jsonStr = JSON.stringify(output_json);

var element = document.createElement('a');
element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
element.setAttribute('download', filename);
element.style.display = 'none';
document.body.appendChild(element);
element.click();
document.body.removeChild(element);



}
// Render
ReactDOM.render(<App />, document.getElementById("root"));


  /**
Acknowledgements;
This is a drag-and-drop programming interface based on React and react-beautiful-dnd.

The structure of this program is directly adapted from examples found at
https://github.com/atlassian/react-beautiful-dnd.

Many helper functions are directly adapted from answers at Online Forums.

This software depends on packages that may be licensed under various open source licenses.

Version V1.0
February 2022
   */