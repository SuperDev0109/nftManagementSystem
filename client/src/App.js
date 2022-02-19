import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { Provider } from 'react-redux';
import store from './store';
import '../src/assets/js/loader.js';

function App() {
  return (
    <Provider store={store}>
      <Router>
          <Routes>
            <Route exact path="/" element={ <Dashboard /> } />
          </Routes>
      </Router>
    </Provider>
  );
}

export default App;
