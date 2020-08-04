import React from "react";
import PropTypes from "prop-types";
import { addZero, isValid } from './date_utils';
import TimeArrowDown from './Icons/time-arrow-down';
import TimeArrowUp from './Icons/time-arrow-up';

export default class inputTime extends React.Component {
  static propTypes = {
    onTimeChange: PropTypes.func,
    timeString: PropTypes.string,
    timeInputLabel: PropTypes.string,
    customTimeInput: PropTypes.element,
    timeFormat: PropTypes.string,
    id: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const time = this.props.timeString;
    let activeState;
    if (this.props.timeFormat === '12') {
      let hourValue = time.getHours();
      activeState = hourValue >= 12 ? 'PM' : 'AM';
      if (parseInt(hourValue, 10) > 12) {
        hourValue = parseInt(hourValue,10) - 12;
        hourValue = hourValue || 12;
      }
      time.setHours(hourValue);
    }

    this.state = {
      time,
      activeState,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.timeString !== this.props.timeString) {
      const time = this.props.timeString;
      const { id } = this.props;
      let activeState;
      let hourValue = addZero(time.getHours());
      let minsValue = addZero(time.getMinutes());
      if (this.props.timeFormat === '12') {

        activeState = hourValue >= 12 ? 'PM' : 'AM';
        if (parseInt(hourValue, 10) > 12) {
          hourValue = parseInt(hourValue,10) - 12;
          hourValue = hourValue || 12;
        }
      }
      this.setState({
        time,
        activeState,
      });
    }
  }

  onTimeChange = (time, type) => {
    console.log(time);
    const date = this.props.timeString;
    if (this.props.timeFormat === '12') {
      if (this.state.activeState === 'PM' && time < 12) {
        time = parseInt(time, 10) + 12;
      }

      if (this.state.activeState === 'AM' && parseInt(time, 10) > 12) {
        time = parseInt(time, 10) - 12;
        time = parseInt(time, 10) || 12;
      }
    }

    if (type === 'hour') {
      date.setHours(time);
    }
    if (type === 'minutes') {
      date.setMinutes(time);
    }
    this.setState({ time: date }, () => {
      this.props.onTimeChange(date);
    });
  };

  renderTimeInput = () => {
    const { time } = this.state;
    const { id, timeFormat } = this.props;
    let hourValue = addZero(time.getHours());
    if (timeFormat === '12' && parseInt(hourValue, 10) > 12) {
      hourValue = addZero(parseInt(hourValue, 10) - 12);
    }
    const minutesValue = addZero(time.getMinutes());
    const { timeString, customTimeInput } = this.props;
    if (customTimeInput) {
      return React.cloneElement(customTimeInput, {
        value: time,
        onChange: this.onTimeChange
      });
    }
    return (
      <>
        <div className="numInputWrapper">
          <input className="numInput react-datepicker-time__input react-datepicker__hour"
            type="number"
            aria-label="Hour"
            tabIndex="-1"
            min="0"
            id={`datepicker-hour-input-${id}`}
            key={`datepicker-hour-input-${id}`}
            max={`${parseInt(timeFormat, 10) - 1}`}
            onChange={ev => {
              this.onTimeChange(ev.target.value, 'hour');
            }}
            required
            value={hourValue}
          />
          <span className="hour-arrow-up input-arrows">
            <TimeArrowUp onClick={() => {
              let hour = parseInt(hourValue, 10);
              if (timeFormat === '24') {
                hour = hour === 24 ? '00' : hour;
              }

              if (timeFormat === '12') {
                hour = hour === 12 ? '00' : hour;
              }
              const setHour = addZero(parseInt(hour, 10) + 1);
              this.onTimeChange(setHour, 'hour');
            }}
            />
          </span>
          <span className="hour-arrow-down input-arrows">
            <TimeArrowDown onClick={() => {
              let hour = parseInt(hourValue, 10);
              if (timeFormat === '24') {
                hour = hour === 0 ? '24' : hour;
              }

              if (timeFormat === '12') {
                hour = hour === 0 ? '12' : hour;
              }
              const setHour = addZero(parseInt(hour, 10) - 1);
              this.onTimeChange(setHour, 'hour');
            }}
            />
          </span>
        </div>
        <span className="react-datepicker-time-separator">:</span>
        <div className="numInputWrapper">
          <input
            className="numInput react-datepicker-time__input react-datepicker__minute"
            type="number"
            aria-label="Minute"
            tabIndex="-1"
            id={`datepicker-mins-input-${id}`}
            key={`datepicker-mins-input-${id}`}
            value={minutesValue}
            onChange={ev => {
              this.onTimeChange(ev.target.value, 'minutes');
            }}
            required
            min="0"
            max="59" />
          <span className="mins-arrow-up input-arrows">
            <TimeArrowUp onClick={() => {
              let mins = parseInt(minutesValue, 10);
              mins = mins === 60 ? '00' : mins;
              const setMins = addZero(mins + 1);
              this.onTimeChange(setMins, 'minutes');
            }}
            />
          </span>
          <span className="mins-arrow-down input-arrows">
            <TimeArrowDown onClick={() => {
              let mins = parseInt(minutesValue, 10);
              mins = mins === 0 ? '60' : mins;
              const setMins = addZero(mins - 1);
              this.onTimeChange(setMins, 'minutes');
            }}
            />
          </span>

        </div>
        {timeFormat !== '24' &&
          <div className="react-datepicker-am-pm-switch">
            <span className={`${this.state.activeState === 'AM' ? 'active' : ''}`} onClick={() => {
              this.setState({
                activeState: 'AM',
              }, () => {
                this.onTimeChange(hourValue, 'hour');
              });
            }}>AM</span>
            <span className={`${this.state.activeState === 'PM' ? 'active' : ''}`} onClick={() => {
              this.setState({
                activeState: 'PM',
              }, () => {
                this.onTimeChange(hourValue, 'hour');
              });
            }}>PM</span>
          </div>}
      </>
    );
  };

  render() {
    return (
      <div className="react-datepicker-time-section">
        <div className="react-datepicker__input-time-container">
          <div className="react-datepicker-time__caption">
            {this.props.timeInputLabel}
          </div>
          <div className="react-datepicker-time__input-container">
            <div className="react-datepicker-time__input">
              {this.renderTimeInput()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
