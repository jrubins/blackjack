import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import cn from 'classnames';

import {
  getCount,
  isCardCounterOpen,
} from '../../../reducers';
import {
  closeCardCounter,
} from '../../../actions/ui';

import CloseIcon from '../icons/close';
import TagPicker from '../forms/tagPicker';

class CardCounter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countOptions: [],
    };
  }

  componentDidMount() {
    const { count } = this.props;

    this.setCountOptions(count);
  }

  componentWillReceiveProps(nextProps) {
    const { count } = this.props;
    const { count: nextCount } = nextProps;

    if (count !== nextCount) {
      this.setCountOptions(nextCount);
    }
  }

  /**
   * Sets the count options with the true count option and alternative (incorrect) options.
   *
   * @param {Number} trueCount
   */
  setCountOptions(trueCount) {
    if (_.isNil(trueCount)) {
      return;
    }

    const countAlternativeValue1 = _.random(1, 4);
    const countAlternativeValue2 = _.random(1, 4);
    const countAlternative1 = (_.random(0, 1) === 1) ? (trueCount + countAlternativeValue1) : (trueCount - countAlternativeValue1);
    const countAlternative2 = (_.random(0, 1) === 1) ? (trueCount + countAlternativeValue2) : (trueCount - countAlternativeValue2);
    const countOptions = _.sortBy([
      {
        label: `${trueCount}`,
        value: trueCount,
      },
      {
        label: `${countAlternative1}`,
        value: countAlternative1,
      },
      {
        label: `${countAlternative2}`,
        value: countAlternative2,
      },
    ], 'value');

    this.setState({
      countOptions,
    });
  }

  render() {
    const {
      cardCounterOpen,
      closeCardCounter,
      count,
      countGuess,
      handleCountGuess,
    } = this.props;
    const { countOptions } = this.state;
    const correctCountGuess = countGuess === count;

    if (!cardCounterOpen) {
      return null;
    }

    return (
      <div className="card-counter">
        <div
          className="card-counter-close"
          onClick={closeCardCounter}
        >
          <CloseIcon />
        </div>
        <div className="card-counter-header">
          <h3>Card Counter</h3>
        </div>
        <div
          className={cn('card-counter-content', {
            'card-counter-content-invalid': _.isNil(count),
          })}
        >
          <span className="card-counter-question">
            What's the count?
          </span>

          <div
            className={cn('card-counter-values', {
              'card-counter-guess-correct': correctCountGuess,
              'card-counter-guess-incorrect': !correctCountGuess,
            })}
          >
            <TagPicker
              handleChange={handleCountGuess}
              options={countOptions}
              value={countGuess}
            />

            {!_.isNil(countGuess) &&
              <span className="card-counter-guess-result">
                {correctCountGuess ? 'Correct' : 'Incorrect'}
              </span>
            }
          </div>
        </div>
      </div>
    );
  }
}

CardCounter.propTypes = {
  cardCounterOpen: PropTypes.bool.isRequired,
  closeCardCounter: PropTypes.func.isRequired,
  count: PropTypes.number,

  countGuess: PropTypes.number,
  handleCountGuess: PropTypes.func.isRequired,
};

export default connect(state => ({
  cardCounterOpen: isCardCounterOpen(state),
  count: getCount(state),
}), {
  closeCardCounter,
})(CardCounter);
