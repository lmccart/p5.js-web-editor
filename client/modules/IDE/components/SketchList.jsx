import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Link, browserHistory } from 'react-router';
import * as SketchActions from '../actions/projects';
import * as ProjectActions from '../actions/project';
import * as ToastActions from '../actions/toast';
import InlineSVG from 'react-inlinesvg';
const exitUrl = require('../../../images/exit.svg');
const trashCan = require('../../../images/trash-can.svg');

class SketchList extends React.Component {
  constructor(props) {
    super(props);
    this.closeSketchList = this.closeSketchList.bind(this);
  }

  componentDidMount() {
    this.props.getProjects(this.props.username);
    document.getElementById('sketchlist').focus();
  }

  closeSketchList() {
    browserHistory.push(this.props.previousPath);
  }

  render() {
    const username = this.props.username !== undefined ? this.props.username : this.props.user.username;
    return (
      <section className="sketch-list" aria-label="project list" tabIndex="0" role="main" id="sketchlist">
        <header className="sketch-list__header">
          <h2 className="sketch-list__header-title">Open a Sketch</h2>
          <button className="sketch-list__exit-button" onClick={this.closeSketchList}>
            <InlineSVG src={exitUrl} alt="Close Sketch List Overlay" />
          </button>
        </header>
        <div className="sketches-table-container">
          <table className="sketches-table" summary="table containing all saved projects">
            <thead>
              <tr>
                <th className="sketch-list__trash-column" scope="col"></th>
                <th scope="col">Sketch</th>
                <th scope="col">Date created</th>
                <th scope="col">Date updated</th>
              </tr>
            </thead>
            <tbody>
              {this.props.sketches.map(sketch =>
                <tr className="sketches-table__row visibility-toggle" key={sketch.id}>
                  <td>
                  {(() => { // eslint-disable-line
                    if (this.props.username === this.props.user.username || this.props.username === undefined) {
                      return (
                        <button
                          className="sketch-list__trash-button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${sketch.name}"?`)) {
                              this.props.deleteProject(sketch.id);
                            }
                          }}
                        >
                          <InlineSVG src={trashCan} alt="Delete Project" />
                        </button>
                      );
                    }
                  })()}
                  </td>
                  <td scope="row"><Link to={`/${username}/sketches/${sketch._id}`}>{sketch.name}</Link></td>
                  <td>{moment(sketch.createdAt).format('MMM D, YYYY h:mm A')}</td>
                  <td>{moment(sketch.updatedAt).format('MMM D, YYYY h:mm A')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  }
}

SketchList.propTypes = {
  user: PropTypes.object.isRequired,
  getProjects: PropTypes.func.isRequired,
  sketches: PropTypes.array.isRequired,
  username: PropTypes.string,
  deleteProject: PropTypes.func.isRequired,
  previousPath: PropTypes.string.isRequired,
  showToast: PropTypes.func.isRequired,
  setToastText: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user,
    sketches: state.sketches
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, SketchActions, ProjectActions, ToastActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SketchList);
