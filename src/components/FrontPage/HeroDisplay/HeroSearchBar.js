import React, { Component } from 'react'

export default class HeroSearchBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      query: ''
    }
   
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    var places = require('places.js');
    const fixedOptions = {
      appId: 'plSF0E41V9AR',
      apiKey: 'fc7783731fbd30b4564f631a78144825',
      container: document.querySelector('#address-input')
    };
    
    const reconfigurableOptions = {
      language: 'tr',
    };
    const placesInstance = places(fixedOptions).configure(reconfigurableOptions);
    placesInstance.configure({
      countries: ['tr'] 
    })
   
  }
  handleChange (event) {
  
    this.setState({ query: event.target.value })
  }
  handleSearch(){
    
  }
  render () {

    return (
      <React.Fragment>
        <form className='search-form' action='/property'>
          <div className='input-wrapper'>
            <input type='search' id="address-input" className='search-input' placeholder='Enter an address, neighborhood, city, or ZIP code'
              value={this.state.query} onChange={this.handleChange} />
            <div className='searchBtnContainer'>
              <button className='search-button'>
                <span className='searchBtnText'>Search</span>
              </button>
            </div>
          </div>
        </form>
      </React.Fragment>
    )
  }
}
