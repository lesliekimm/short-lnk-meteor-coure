import 'babel-polyfill';
import { Meteor } from 'meteor/meteor';
import Modal from 'react-modal';
import React from 'react';

export default class AddLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      isOpen: false,
      url: ''
    };
  }

  onChange(e) {
    this.setState({url: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault();

    const url = this.state.url.trim();
    Meteor.call('links.insert', url, (err, res) => {
      if (err)
        this.setState({error: err.reason});
      else
        this.handleModalClose();
    });
  }

  handleModalClose() {
    this.setState({
      error: '',
      isOpen: false,
      url: ''
    })
  }

  render() {
    return (
      <div>
        <button className="button" onClick={() => this.setState({isOpen: true})}>+ Add Link</button>
        <Modal
          contentLabel="Add link"
          className="boxed-view__box"
          isOpen={this.state.isOpen}
          onAfterOpen={() => this.refs.url.focus()}
          onRequestClose={this.handleModalClose.bind(this)}
          overlayClassName="boxed-view boxed-view__overlay">
          <h1>Add Link</h1>
          {this.state.error ? <p>{this.state.error}</p> : undefined}
          <form onSubmit={this.onSubmit.bind(this)} className="boxed-view__form">
            <input
              onChange={this.onChange.bind(this)}
              placeholder="Add link here"
              ref="url"
              type="text"
              value={this.state.url} />
            <button className="button">Add Link</button>
            <button
              className="button button--secondary"
              onClick={this.handleModalClose.bind(this)}
              type="button">
                Cancel
              </button>
          </form>
        </Modal>
      </div>
    );
  }
};
