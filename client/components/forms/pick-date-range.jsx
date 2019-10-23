import React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

export default class PickDateRange extends React.Component {
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
  }

  handleDayClick(day, { selected }) {
    const { selectedDays } = this.props;
    if (selected) {
      const selectedIndex = selectedDays.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }
    this.props.handleDates(selectedDays);
  }

  render() {
    return (
      <div>
        <DayPicker
          selectedDays={this.props.selectedDays}
          onDayClick={this.handleDayClick}
        />
      </div>
    );
  }
}
