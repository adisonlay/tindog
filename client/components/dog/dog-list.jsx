import React from 'react';
import DogCard from './dog-card';
import { TabContent, TabPane, Nav, NavItem, NavLink, Container, Row } from 'reactstrap';
import ListingPanel from '../listing/listing-panel';
const qs = require('query-string');

export default class DogList extends React.Component {
  constructor(props) {
    super(props);
    this.toggleTab = this.toggleTab.bind(this);
    this.state = {
      dogs: [],
      playdates: [],
      activeTab: '1'
    };
  }

  toggleTab(tab) {
    this.setState({ activeTab: tab });
  }

  componentDidUpdate(nextProps) {
    if (this.props.history.location.pathname !== nextProps.history.location.pathname) {
      this.getDogs();
    }
  }

  componentDidMount() {
    this.getDogs();
  }

  getDogs() {
    const query = qs.parse(location.search);
    if (Object.keys(query).length) {
      const extractedQueryString = qs.extract(location.search);
      fetch('/api/get-dogs/?' + extractedQueryString)
        .then(res => res.json())
        .then(dogs => {
          if (!dogs.success) {
            throw new Error(dogs.data);
          }
          this.setState({ dogs: dogs.data });
        });
    } else {
      fetch('/api/get-dogs/')
        .then(res => res.json())
        .then(dogs => {
          if (!dogs.success) {
            throw new Error(dogs.data);
          }
          this.setState({ dogs: dogs.data });
        });
    }
  }

  findDogsWithPlaydates(allDogs) {
    const dogsWithPlaydates = allDogs.filter(dog => dog.playdates && dog.playdates.length > 0);
    return dogsWithPlaydates;
  }

  render() {
    const { dogs, activeTab } = this.state;
    return (
      <Container fluid className="px-5">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={(activeTab === '1') ? 'active' : ''}
              onClick={() => { this.toggleTab('1'); }}
            >
              Dogs
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={(activeTab === '2') ? 'active' : ''}
              onClick={() => { this.toggleTab('2'); }}
            >
              Playdates
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <h4>{dogs.length} Dogs Nearby</h4>
            <Row>
              {
                dogs.map(dog => <DogCard key={dog.id} dog={dog} />)
              }
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <h4 className="my-3">Playdate Listings</h4>
            {this.findDogsWithPlaydates(this.state.dogs).map(dog => <ListingPanel key={dog.id} dog={dog} />)}
          </TabPane>
        </TabContent>
      </Container>
    );
  }
}
