import React from 'react'
import ReactModal from 'react-modal'

export default class SrcdModal extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div>
                <ReactModal
                    isOpen={Boolean(this.props.modalUrl)}
                    contentLabel="source{d} modal"
                    portalClassName="SourcedModalPortal"
                    overlayClassName="SourcedModalOverlay"
                    className="SourcedModalContent"
                    shouldCloseOnOverlayClick={true}
                    onRequestClose={this.props.handler(null)}
                    closeTimeoutMS={300}
                >
                    <div id="closeModal" onClick={this.props.handler(null)}>x</div>
                    <iframe src={this.props.modalUrl}></iframe>
                </ReactModal>
            </div>
        );
    }
}
