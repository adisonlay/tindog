import React from 'react';
import {
  Card, CardText, CardBody,
  CardTitle, CardSubtitle
} from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { startCase, toLower } from 'lodash';
import { convertEnergyLevel } from './../help/functions';
import DogSmCarousel from './dog-sm-carousel';

class DogCard extends React.Component {
  constructor(props) {
    super(props);
    this.toDog = this.toDog.bind(this);
  }

  toDog() {
    this.props.history.push(`/dog/${this.props.dog.id}`);
  }

  render() {
    const { dog } = this.props;
    const cardStyle = {
      border: 'none',
      overflow: 'hidden',
      borderTopLeftRadius: '1.5%',
      borderTopRightRadius: '1.5%'
    };
    const cardBodyStyle = {
      padding: '.25rem'
    };
    const energy = convertEnergyLevel(dog.energy_lvl);
    return (
      <div className="col-xl-3 col-lg-4 col-sm-6">
        <Card style={cardStyle} className="dog-list-card mb-3">
          <DogSmCarousel items={dog.images} dogID={dog.id}/>
          <Link to={`/dog/${dog.id}`}>
            <CardBody style={cardBodyStyle}>
              <CardTitle className="mb-1 position-relative">
                <span className="font-weight-bold">
                  {dog.name} {' '}
                </span>
                <span className="">
                  - {startCase(toLower(dog.breed))}
                </span>
                <span className="float-right">
                  <i className="fas fa-dumbbell oc-weight-color" title="Weight"></i> {dog.weight} lbs
                </span>
              </CardTitle>
              <CardSubtitle className="d-flex w-100 justify-content-between">
                <span>
                  <i className="fas fa-birthday-cake oc-txt-red" title="Age"></i> {' '}{dog.age}
                </span>
                <span >
                  {dog.display_address}
                </span>
              </CardSubtitle>
              <CardText className="dog-card-last-row">
                <span>
                  <i className="fas fa-transgender-alt oc-txt-blue" title="Gender"></i>
                  {' '}{dog.sex}
                </span>
                <span>
                  <i className="fas fa-bolt oc-txt-orange" title="Energy Level"></i>
                  {' '}{
                    (energy === 'Medium') ? 'Med' : energy
                  }
                </span>
                <span>
                  <i className="fas fa-calendar-day oc-txt-brown" title="Number of Dates"></i>
                  {' '}{dog.num_dates} dates
                </span>
                <span className="float-right miles">
                  {(dog.miles || dog.miles === 0) ? <p>{dog.miles.toFixed(1)} mi</p> : undefined}
                </span>
              </CardText>
            </CardBody>
          </Link>
        </Card>
      </div>
    );
  }
}

export default withRouter(DogCard);
