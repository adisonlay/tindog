import React from 'react';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Label, CustomInput, Button } from 'reactstrap';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.handleGenderSelect = this.handleGenderSelect.bind(this);
    this.handleEnergyLevelCheckboxes = this.handleEnergyLevelCheckboxes.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openInputDropdown = this.openInputDropdown.bind(this);
    this.closeInputDropdown = this.closeInputDropdown.bind(this);
    this.resetFilterOptions = this.resetFilterOptions.bind(this);
    this.state = {
      dropdownOpen: false,
      genderFilter: 'A',
      weightRangeFilter: {
        min: 0,
        max: 125
      },
      ageRangeFilter: {
        min: 0,
        max: 10
      },
      energyLevelFilter: {
        lowChecked: false,
        mediumChecked: false,
        highChecked: false
      }
    };
  }
  handleGenderSelect(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }
  handleEnergyLevelCheckboxes(event) {
    const energyLevelChecked = event.target.name;
    const checked = event.target.checked;
    this.setState(prevState => {
      return {
        energyLevelFilter: {
          lowChecked: energyLevelChecked === 'lowChecked' ? checked : prevState.energyLevelFilter.lowChecked,
          mediumChecked: energyLevelChecked === 'mediumChecked' ? checked : prevState.energyLevelFilter.mediumChecked,
          highChecked: energyLevelChecked === 'highChecked' ? checked : prevState.energyLevelFilter.highChecked
        }
      };
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.closeInputDropdown();
    const newQueryString = this.buildQueryString();
    this.props.history.push(newQueryString);
  }
  buildQueryString() {
    let newQueryString = '/search?';
    const queryParams = qs.parse(location.search);
    const {
      genderFilter: gender,
      weightRangeFilter: weight,
      ageRangeFilter: age,
      energyLevelFilter: energy
    } = this.state;

    queryParams.gender = gender;
    queryParams.wmin = weight.min;
    queryParams.wmax = weight.max;
    queryParams.amin = age.min;
    queryParams.amax = age.max;
    queryParams.low = energy.lowChecked ? 1 : 0;
    queryParams.med = energy.mediumChecked ? 1 : 0;
    queryParams.high = energy.highChecked ? 1 : 0;

    newQueryString += qs.stringify(queryParams);
    return newQueryString;
  }
  openInputDropdown() {
    this.setState({ dropdownOpen: true });
  }
  closeInputDropdown() {
    this.setState({ dropdownOpen: false });
  }
  resetFilterOptions() {
    this.setState({
      genderFilter: 'A',
      weightRangeFilter: {
        min: 0,
        max: 250
      },
      ageRangeFilter: {
        min: 0,
        max: 25
      },
      energyLevelFilter: {
        lowChecked: true,
        mediumChecked: true,
        highChecked: true
      }
    });
  }
  render() {
    return (
      <UncontrolledDropdown isOpen={this.state.dropdownOpen} inNavbar className="mx-2 filter-navbar">
        <button className="oc-bg-grey oc-btn-grey dropdown-toggle btn active" caret={'true'} onClick={this.state.dropdownOpen ? this.closeInputDropdown : this.openInputDropdown}
          aria-haspopup={true}
          aria-expanded={false}
          aria-pressed="true"
        >
          Filter
        </button>
        <DropdownMenu right className="px-5 py-4" style={{ width: 'max-content' }}>
          <span className="h4 ml-n3">Filter Dogs</span>
          <Button color="link" className="p-0" style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }} onClick={this.resetFilterOptions}>Reset Filters</Button>

          <DropdownItem divider />

          <Form onSubmit={this.handleSubmit}>
            <FormGroup tag="fieldset" className="mb-4" onChange={this.handleGenderSelect}>
              <p className="mb-1 ml-n3">Gender</p>
              <FormGroup check inline>
                <CustomInput
                  type="radio"
                  name="genderFilter"
                  id="femaleRadioOption"
                  value="F"
                  checked={this.state.genderFilter === 'F'} />
                <Label check htmlFor="femaleRadioOption">Females</Label>
              </FormGroup>
              <FormGroup check inline>
                <CustomInput
                  type="radio"
                  name="genderFilter"
                  id="maleRadioOption"
                  value="M"
                  checked={this.state.genderFilter === 'M'} />
                <Label check htmlFor="maleRadioOption">Males</Label>
              </FormGroup>
              <FormGroup check inline>
                <CustomInput
                  type="radio"
                  name="genderFilter"
                  id="allRadioOption"
                  value="A"
                  checked={this.state.genderFilter === 'A'} />
                <Label check htmlFor="otherRadioOption">All</Label>
              </FormGroup>
            </FormGroup>

            <FormGroup className="mb-5">
              <p className="ml-n3">Weight</p>
              <InputRange
                maxValue={250}
                minValue={0}
                step={5}
                formatLabel={value => `${value} lb`}
                value={this.state.weightRangeFilter}
                onChange={value => this.setState({ weightRangeFilter: value })} />
            </FormGroup>

            <FormGroup className="mb-5">
              <p className="ml-n3">Age</p>
              <InputRange
                maxValue={25}
                minValue={0}
                formatLabel={value => `${value} yrs`}
                value={this.state.ageRangeFilter}
                onChange={value => this.setState({ ageRangeFilter: value })} />
            </FormGroup>

            <FormGroup className="mb-4">
              <Label htmlFor="energyLevelFilter" className="ml-n3">Energy Level</Label>
              <div>
                <CustomInput
                  type="checkbox"
                  name="lowChecked"
                  id="lowChecked"
                  label="Low"
                  checked={this.state.energyLevelFilter.lowChecked}
                  onChange={this.handleEnergyLevelCheckboxes}
                  inline />
                <CustomInput
                  type="checkbox"
                  name="mediumChecked"
                  id="mediumChecked"
                  label="Medium"
                  checked={this.state.energyLevelFilter.mediumChecked}
                  onChange={this.handleEnergyLevelCheckboxes}
                  inline />
                <CustomInput
                  type="checkbox"
                  name="highChecked"
                  id="highChecked"
                  label="High"
                  checked={this.state.energyLevelFilter.highChecked}
                  onChange={this.handleEnergyLevelCheckboxes}
                  inline />
              </div>
            </FormGroup>

            <DropdownItem divider />

            <FormGroup className="float-right">
              <button type="submit" className="oc-bg-blue oc-btn-blue btn btn-sm active mx-2">Apply Filters</button>
              <button className="oc-bg-grey oc-btn-grey btn btn-sm active" onClick={event => {
                event.preventDefault();
                event.stopPropagation();
                this.closeInputDropdown();
              }}>
                  Close
              </button>
            </FormGroup>
          </Form>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}

export default withRouter(Filter);
