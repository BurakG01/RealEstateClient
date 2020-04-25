import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import places from 'places.js'
class HeroSearchBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      query: '',
    }

    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {

    const fixedOptions = {
      appId: 'plSF0E41V9AR',
      apiKey: 'fc7783731fbd30b4564f631a78144825',
      container: document.querySelector('#address-input'),

    };

    const reconfigurableOptions = {
      language: 'tr',
      type: ['city', 'address'],
      aroundLatLngViaIP: false

    };
    var placesAutocomplete = places(fixedOptions).configure(reconfigurableOptions);
    placesAutocomplete.configure({
      countries: ['tr']
    })

    placesAutocomplete.on('change', e => {

      var query = '';
      if (e.suggestion.type === "city") {

        if (e.suggestion.administrative) {
          query = `city=${e.suggestion.administrative}&&town=${e.suggestion.name}`
        } else {
          query = `city=${e.suggestion.name}`
        }

      } else if (e.suggestion.type === "address") {

        query = `city=${e.suggestion.administrative}&&town=${e.suggestion.county}&&street=${e.suggestion.name}`
      } else {
        console.log(query)
      }
   

      this.props.history.push({
        pathname:'/property',
        search:query
      })
    });
  }
  handleChange(event) {
    this.setState({ query: event.target.value })
  }
  handleSearch() {


  }
  render() {

    return (
      <React.Fragment>
        <form className='search-form'>
          <div className='input-wrapper'>
            <input type='search' id="address-input" className='search-input' placeholder='Nerede Yaşamak İstersin?'
              onChange={this.handleChange} />
            <div className='searchBtnContainer'>
              <button className='search-button' >
                <span className='searchBtnText'>Search</span>
              </button>
            </div>
          </div>
        </form>
      </React.Fragment>
    )
  }
}
export default withRouter(HeroSearchBar);