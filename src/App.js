import React from 'react';
import { Input, Icon, Checkbox } from "antd";
import "antd/dist/antd.css";
import './App.css';

const { Component } = React

/* === form input ===== */
class AddForm extends Component {
  render() {
    return (
      //form for inputting items
      <div className="body">
          <div className="con">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input type="text" ref="listItem" placeholder="What needs to be done..." />
              <button className="sub">Submit</button>
            </form>
            
          </div>
      </div>
    )
  }//

  //getting and storing the value from textbox
  handleSubmit(e) {
    // when form is submitted, send input value to parent component
    e.preventDefault()
    let val = [this.refs.listItem.value] // get value from textbox

    if(val != ''){
      var item =
      {
        text: this.refs.listItem.value,
        completed: true
      }
      console.log(item)
      this.props.addItem(val) // call the addItem from parent component through props if value not empty
    }

    this.refs.listItem.value = '' // reset input field to blank
  }
}



/* ===== parent component ===== */
class App extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      items: {
        text: '',
        completed: false
      }
    }
  }

  render() {
    // 
    return (
      <div>
        <header className="App-header">
          <h1>myTodos</h1>
        </header>

        <AddForm addItem={this.addItem.bind(this)} /> 
        <Items 
          items={this.state.items} 
          removeItem={this.removeItem.bind(this)}
          onChange={this.onChange.bind(this)}
        />

        <div className="control">
          <label id="countlbl"> {this.state.items.length} items left</label>
          
          <button className="contrl">All</button>
          <button className="contrl">Active</button>
          <button className="contrl">Completed</button>
          <button className="clr">Clear Completed</button>

        </div>
      </div>
    )
  }

  addItem(item) {
    // getting input value from child component --> adding it to state items array

    this.setState({
      items: this.state.items.concat(item)
    })
  }

  onChange(key){
    const tempItems = this.state.items.slice()
    tempItems.forEach((item) => {
      if (item.key===key){
        item.completed = !item.completed;
      }

    })
    this.setState({
      items: tempItems,
    })

  }

  removeItem(key) {
    // filter method --> taking out item that matches value of clicked item
    let newList =[]
    for( let i = 0; i <this.state.items.length;i++){
      if(i !== key)
      newList.push(this.state.items[i])
    }
    // setting the filtered array as new state --> all items minus clicked item
    this.setState({
      items: newList
    })
    console.log("handleRemove2 worked!");
  }

  componentWillMount() {
    // load items array from localStorage, set in state
    let itemsList = localStorage.getItem('items')
    if (itemsList) {
      this.setState({
        items: JSON.parse(localStorage.getItem('items'))
      })
    }
  }
  componentDidUpdate() {
    // on each update, sync our state with localStorage
    localStorage.setItem('items', JSON.stringify(this.state.items))
  }
}

/* ===== items list ===== */
class Items extends Component {

  onChange(key) {
    this.props.onChange(key) // pass value of item to delete to parent component
    console.log("1 onChange worked and the key is "+key)
  }

  render() {
    // display all items

    let items = this.props.items.map((item, key) => {
      return <li key={key}>
        <Checkbox className="Checkbox" checked={item.completed} onChange={() => this.onChange(key)}>
          {item}
        </Checkbox>

        <Icon className="delIcon" 
          type="close" onClick={() => this.handleRemove(key)}/>
      </li> //assuming handleRemove will be call later
    })

    return (
      <ul>
        {items}
      </ul>
    )
  }

  

  handleRemove(key) {
    this.props.removeItem(key) // pass value of item to delete to parent component
    console.log("handleRemove1 worked! and the key is: "+ key);
  }
}
export default App;
