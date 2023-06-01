import Container from "react-bootstrap"
import Nav from "react-bootstrap/Nav"
import NavBar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

function App()
{
    return(
        <div>
            <NavBar bg='dark'></NavBar>
            <div>Hello World</div>
            <div>{1 + 1}</div>
        </div>
    )
}

export default App