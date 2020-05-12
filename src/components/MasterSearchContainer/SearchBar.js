import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadProperties, filterProperties } from "../../redux/actions";
import { Query } from '@syncfusion/ej2-data';
import RepositoryFactory from '../../Api/RepositoryFactory'
import { enableRipple } from '@syncfusion/ej2-base';
import { ButtonComponent, ChipDirective, ChipListComponent, ChipsDirective } from '@syncfusion/ej2-react-buttons';
import {
  MultiSelectComponent,
  CheckBoxSelection,
  Inject, DropDownListComponent
} from '@syncfusion/ej2-react-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
enableRipple(true);
class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageNumber: 0,
      filter: {},
      listings: [],
      properties: [],
      selectedRooms: [],
      furnitureType: '',
      city: '',
      keyword: '',
      towns: [],
      counties: [],
      cities: [
        { Name: 'Adana', Code: 'ada' },
        { Name: 'Hatay', Code: 'hat' },
        { Name: 'Mersin', Code: 'CM' },
        { Name: 'Diyarbakır', Code: 'DK' }
      ],
      ownerType: '',
      homeType: '',
      rooms: [
        { Name: '3+1', Code: '1' },
        { Name: '2+1', Code: '2' },
        { Name: '4+1', Code: '3' },
        { Name: '1+1', Code: '4' }],

      streets :[],
      streetList:[],
      countiesCode:[]
    }

    this.checkFields = { text: 'Name', value: 'Code' };
    this.countyFields = { text: 'name', value: 'code' };
    this.checkStreetFields = { groupBy: 'district', text: 'name', value: 'id' };

    this.onFiltering = (e) => {
      let query = new Query();
      query = (e.text !== '') ? query.where('Name', 'startswith', e.text, true) : query;
      e.updateData(this.state.counties, query);
    };
  }

  componentWillMount = () => {
    const params = new URLSearchParams(this.props.location.search)
    let filter = {
      city: params.get('city'),
      towns: params.get('town') ? [params.get('town')] : null,
    }

    this.getListings(filter);
  }

  getListings = filter => {

    const listingRepository = RepositoryFactory.get("listings");
    listingRepository.getPost(filter).then((res) => {
      let listings = [];
      res.data.listings.forEach(listing => {
        listings.push({

          owners: listing.owners,
          ownerSite: listing.listing.ownerSite,
          homeType: listing.listing.advertStatus,
          address: listing.listing.street,
          price: listing.listing.price,
          city: listing.listing.city,
          state: listing.listing.town,
          rooms: listing.listing.roomNumber,
          isForSale: true,
          isForRent: true,
          wasSold: false,
          listingType: 'isForSale',
          image: listing.listing.coverImage,
          extras: [
            'elevator',
            'gym'
          ],
        });
      });
    
      this.props.loadProperties(listings)

      this.setState({ properties: this.props.properties })

    }).catch((err) => {
      console.log("err", err);
    })
  }
  SelectedCity = args => {
    const locationRepository = RepositoryFactory.get("locations");
    locationRepository.getPost(args.itemData.Name).then((response) => {
      this.setState({ counties: response.data })
    })
    this.setState({
      city: args.itemData.Name
    });
  }

  countiesSelection=event=>{
    const locationRepository = RepositoryFactory.get("locations");
    let countiesCode =this.state.countiesCode;
    let towns=this.state.towns;
    var code = event.itemData.code;
    var name=event.itemData.name
    if(event.name==="removing"){
      var nameIndex = towns.indexOf(name)
      var codeIndex = towns.indexOf(code)
      towns.splice(nameIndex, 1);
      countiesCode.splice(codeIndex,1)
    }else{
      towns.push(name);
      countiesCode.push(code);
    } 
    
    locationRepository.getPostNeighborhoods({towns:this.state.countiesCode}).then((response) => {
      this.setState({streets: response.data })
    })
  }
  roomsSelection=event=>{
    let selectedRooms =this.state.selectedRooms;
    var value = event.itemData.Name;
    if(event.name==="removing"){
      var index = selectedRooms.indexOf(value)
      selectedRooms.splice(index, 1);
    }else{
      selectedRooms.push(value);
    }
  }
  streetSelection=event=>{
   
    let streetList =this.state.streetList;
    var value = event.itemData.id;
    if(event.name==="removing"){
      var index = streetList.indexOf(value)
      streetList.splice(index, 1);
    }else{
      streetList.push(value);
    }
  }

  search = () => {
    let city = this.state.city
    let towns = this.state.towns
    let rooms = this.state.selectedRooms
    let ownerType = this.state.ownerType
    let homeType = this.state.homeType
    let furnitureType = this.state.furnitureType
    let query = this.state.keyword
    let streets=this.state.streetList
    let filter = {
      city: city,
      towns: towns,
      roomNumber: rooms,
      advertOwnerType: ownerType,
      advertStatus: homeType,
      furnitureType: furnitureType,
      query: query,
      streets:streets

    }
    this.getListings(filter)
  }
  AdvertType = event => {
    this.setState({
      homeType: event.selected ? event.data.value : '',
    });

  }
  onChangeStrees=event=>{
    this.setState({
      streetList: event.value,
    });
  }
  AdvertOwnerType = event => {
    this.setState({
      ownerType: event.selected ? event.data.value : '',
    });
  }
  FurnitureType = event => {
    this.setState({
      furnitureType: event.selected ? event.data.value : '',
    });
  }
  keyword = (event) => {
    this.setState({
      keyword: event.value,
    });
  }
  render() {
    return (
      <div className="container">
        <section>
          <section>
            <div className='control-pane'>
              <div className='control-section col-lg-8'>
                <div id='filtering' className="control-styles">
                  <DropDownListComponent
                    id="country" ref={(dropdownlist) => { this.listObj = dropdownlist; }}
                    dataSource={this.state.cities} filtering={this.onFiltering.bind(this)}
                    select={this.SelectedCity}
                    noRecordsTemplate={"Eşleşme Bulunamadı"}
                    filterBarPlaceholder='Şehir' allowFiltering={true} fields={this.checkFields}
                    placeholder="Şehir " popupHeight="220px" />
                </div>
              </div>
            </div>
          </section>
          <br></br>
          <section>
            <div id="multichecbox" className='control-pane'>
              <div className='control-section col-lg-8'>
                <div id="multigroup" className="control-styles">
                  <MultiSelectComponent id="checkbox"
                    ref={(scope) => { this.mulObj1 = scope; }}
                    dataSource={this.state.counties}
                    fields={this.countyFields}
                    placeholder="İlçe " mode="CheckBox"
                    showSelectAll={true}
                    selectAllText={"Hepsi"}
                    unSelectAllText={"Hiçbiri"}
                    showDropDownIcon={true}
                    select={this.countiesSelection.bind(this)}
                    removing={this.countiesSelection.bind(this)}
                    noRecordsTemplate={"Eşleşme Bulunamadı"}
                    filterBarPlaceholder="İlçe " popupHeight="350px">
                    <Inject services={[CheckBoxSelection]} />
                  </MultiSelectComponent>
                </div>
              </div>
            </div>
          </section>
          <br></br>
          <section>
            <div id="multichecbox" className='control-pane'>
              <div className='control-section col-lg-8'>
                <div id="multigroup" className="control-styles">
                  <MultiSelectComponent id="checkbox" ref={(scope) => { this.mulObj4 = scope; }}
                     dataSource={this.state.streets}
                    fields={this.checkStreetFields}
                    enableGroupCheckBox={true}
                    removing={this.streetSelection.bind(this)}
                    select={this.streetSelection.bind(this)}
                    placeholder="Mahalle "
                    selectAllText={"Hepsi"}
                    unSelectAllText={"Hiçbiri"}
                    noRecordsTemplate={"Eşleşme Bulunamadı"}
                    mode="CheckBox" showSelectAll={true}
                    showDropDownIcon={true} filterBarPlaceholder="Mahalle " popupHeight="350px">
                    <Inject services={[CheckBoxSelection]} />
                  </MultiSelectComponent>
                </div>
              </div>
            </div>
          </section>
          <br></br>
          <section>
            <div id="multichecbox" className='control-pane'>
              <div className='control-section col-lg-8'>
                <div id="multigroup" className="control-styles">
                  <MultiSelectComponent id="checkbox" ref={(scope) => { this.mulObj3 = scope; }}
                    dataSource={this.state.rooms}
                    fields={this.checkFields}
                    showDropDownIcon={true}
                    removing={this.roomsSelection.bind(this)}
                    select={this.roomsSelection.bind(this)}
                    placeholder="Oda Sayısı"
                    selectAllText={"Hepsi"}
                    unSelectAllText={"Hiçbiri"}
                    mode="CheckBox"
                    showSelectAll={true}
                    allowFiltering={false}
                    showDropDownIcon={true} popupHeight="350px">
                    <Inject services={[CheckBoxSelection]} />
                  </MultiSelectComponent>
                </div>
              </div>
            </div>
          </section>
          <br></br>
          <br></br>
          <section>
            <div id="multichecbox" className='control-pane'>
              <div className='control-section col-lg-8'>
                <div id="multigroup" className="control-styles">
                  <TextBoxComponent input={this.keyword.bind(this)}
                    placeholder="Kelime ile Ara" cssClass="e-outline" floatLabelType="Auto" />
                </div>
              </div>
            </div>
          </section>
          <br></br>
          <br></br>
          <section>
            <div className="d-flex justify-content-center">
              <ChipListComponent click={this.AdvertType.bind(this)} id="chip-choice" selection="Single" cssClass="e-outline">
                <ChipsDirective  >
                  <ChipDirective text="Hepsi" value=""></ChipDirective>
                  <ChipDirective text="Kiralık" value="Kiralık" ></ChipDirective>
                  <ChipDirective text="Satılık" value="Satılık"></ChipDirective>
                </ChipsDirective>
              </ChipListComponent>
            </div>
          </section>
          <br></br>
          <section>
            <div className="d-flex justify-content-center">
              <ChipListComponent click={this.AdvertOwnerType.bind(this)} id="chip-choice" selection="Single" cssClass="e-outline">
                <ChipsDirective  >
                  <ChipDirective text="Hepsi" value=""></ChipDirective>
                  <ChipDirective text="Sahibinden" value="Personal" ></ChipDirective>
                  <ChipDirective text="Emlakçıdan" value="RealEstateAgent"></ChipDirective>
                </ChipsDirective>
              </ChipListComponent>
            </div>
          </section>
          <br></br>
          <section>
            <div className="d-flex justify-content-center">
              <ChipListComponent click={this.FurnitureType.bind(this)} id="chip-choice" selection="Single" cssClass="e-outline">
                <ChipsDirective  >
                  <ChipDirective text="Hepsi" value=""></ChipDirective>
                  <ChipDirective text="Eşyalı" value="Eşyalı" ></ChipDirective>
                  <ChipDirective text="Eşyasız" value="Eşyasız"></ChipDirective>
                </ChipsDirective>
              </ChipListComponent>
            </div>
          </section>
          <section>
            <div id="multichecbox" className='control-pane'>
              <div className='control-section col-lg-8'>
                <div id="multigroup" className="control-styles">
                  <ButtonComponent onClick={this.search} cssClass='e-custom' id="btn">Ara</ButtonComponent>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  properties: state.properties,
})


export default connect(mapStateToProps, { loadProperties, filterProperties })(SearchBar);