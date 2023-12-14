import { Grid, Paper } from '@mui/material';
import {Scene} from 'robot-scene'
import './App.css';

function App() {
  return (
    <div className="App">
      <Grid container spacing={2} >
        <Grid item xs={3} style={{height: '100vh' ,backgroundColor:'lightblue'}}>
        
        </Grid>
        <Grid item xs={9} style={{height: '50vh' }}>
          <Scene />
        </Grid>
        
      </Grid>
    </div>
  );
}

export default App;
