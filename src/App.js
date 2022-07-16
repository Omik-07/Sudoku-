import { useState } from 'react';
import './App.css';


let initial = [
  [-1, 5, -1, 9, -1, -1, -1, -1, -1],
  [8, -1, -1, -1, 4, -1, 3, -1, 7],
  [-1, -1, -1, 2, 8, -1, 1, 9, -1],
  [5, 3, 8, 6, -1, 7, 9, 4, -1],
  [-1, 2, -1, 3, -1, 1, -1, -1, -1],
  [1, -1, 9, 8, -1, 4, 6, 2, 3],
  [9, -1, 7, 4, -1, -1, -1, -1, -1],
  [-1, 4, 5, -1, -1, -1, 2, -1, 9],
  [-1, -1, -1, -1, 3, -1, -1, 7, -1]
];

function App() {
  const [sudoku, setsudoku] = useState(getDeepcopy(initial));

  function getDeepcopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }
  function onInputChange(e, row, col) {
    var val = parseInt(e.target.value) || -1, grid = getDeepcopy(sudoku);
    //Input value should range from 1-9 and for empty cell it should be -1
    if (val === -1 || (val >= 1 && val <= 9)) {
      grid[row][col] = val;
    }
    setsudoku(grid);
  }

  function comparesudoku(curr, solved)
  {
    let res ={
      isComplete : true,
      isSolvable : true
    }
    for(var ii=0;ii<9;ii++)
    {
      for(var jj=0;jj<9;jj++)
      {
        if(curr[ii][jj] !== solved[ii][jj])
        {
          if(curr[ii][jj] !== -1)
          {
            res.isSolvable = false;
          }
          res.isComplete = false;
        }
      }
    }
    return res;
  }
  //function to check wether given input gives valid sudoku or not 
  function Check()
  {
    let sudokuarr= getDeepcopy(initial);
    solver(sudokuarr);
    let Compare = comparesudoku(sudoku,sudokuarr);
    if(Compare.isComplete)
    {
      alert("Congratulations, You did it!!");
    }
    else if(Compare.isSolvable)
    {
      alert("Keep going, You're doing well");
    }
    else
    {
      alert("Sudoku can't be solved, Try again!")
    }
  }
  //check number is unique in the row
  function validrow(grid, row, i)
  {
    return grid[row].indexOf(i) === -1 ;
  }

  //check number is unique in the col
  function validcol(grid, col, i)
  {
    return grid.map(row =>row[col]).indexOf(i) === -1; 
  }
  
  //check number is unique in the box
  function validBox(grid, row, col, i)
  {
    //get box start index
    let boxarr=[],
    rowstart = row- (row%3),
    colstart = col- (col%3);
    for(let ii=0;ii<3;ii++)
    {
      for(let jj=0;jj<3;jj++)
      {
        //get all the cell number and push int the box array 
        boxarr.push(grid[rowstart+ii][colstart+jj]);
      }
    } 
    return boxarr.indexOf(i) === -1;
  }

  function isvalid(grid, row, col, i)
  {
    //check in row, col & 3X3 box for unique number
    if(validrow(grid, row, i) && validcol(grid, col, i) && validBox(grid, row, col, i))
    {
      return true;
    }
    return false;
  }

  function getNext(row, col)
  {
    //if column reaches 8 increase row number
    //if row reaches 8 and col reaches 8, next cell will be [0,0]
    //if col doen't reaches 8 increase col number
    return col !== 8 ? [row,col+1] : row !== 8? [row+1,0] : [0,0];
  }
  //function to solve the sudoku
  function solver(grid, row=0, col=0)
  {
    if(grid[row][col] !== -1)
    {
      let islast= row>=8 && col>=8;
      if(!islast)
      {
        let [newr, newc] =getNext(row,col);
        return solver(grid, newr, newc);
      }
    }
    for(let i=1;i<=9;i++)
    {
      //check if number can be valid at the position 
      if(isvalid(grid, row, col, i))
      {
        //fill the number in the cell
        grid[row][col] = i;
        //go to the next cell and repeat the function
        let [newr,newc]= getNext(row, col);

        if(!newr && !newc)
        {
          return true;
        }

        if(solver(grid, newr, newc))
        {
          return true;
        }
      }
    }
    //if number is not valid put -1 instead
    grid[row][col] = -1;
    return false;
  }

  //function to solve sudoku by nevigating to each cell
  function Solve()
  {
    let sudokuarr= getDeepcopy(initial);
    solver(sudokuarr);
    setsudoku(sudokuarr);
  }

  //function to reset the given sudoku
  function Reset()
  {
    let sudokuarr= getDeepcopy(initial);
    setsudoku(sudokuarr);
  }

  return (
    <div className="App">
      <div className="App-header">
        <h1>Sudoku</h1>
        <table>
          <tbody>
            {
              [0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) => {
                return(
                <>
                  <tr key={rIndex} className={(row + 1) % 3 === 0 ? 'bBorder' : ''}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => {
                      return <td key={rIndex + cIndex} className={(col + 1) % 3 === 0 ? 'rBorder' : ''}>
                        <input onChange={(e) => onInputChange(e, row, col)}
                          value={sudoku[row][col] === -1 ? '' : sudoku[row][col]}
                          className="cellInput"
                          disabled={initial[row][col] !== -1} />
                      </td>
                    })}
                  </tr>
                </>)
              })
            }
          </tbody>
        </table>
        <div className="Button">
          <button className="resetButton" onClick={Reset}>Reset</button>
          <button className="solveButton" onClick={Solve}>Solve</button>
          <button className="checkButton" onClick={Check}>Check</button>
        </div>
      </div>
    </div>
  );
}

export default App;
