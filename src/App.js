import React from 'react'
import './App.css';
import axios from 'axios'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: '',
      selectedFilename: '',
      selectedFileSize: '',
      emailSent: false,
      response: ''
    }
  }

  handleFile = (event) => {
    try {
      let reader = new FileReader();
      let files = event.target.files;
      reader.readAsDataURL(files[0]);
      reader.onload = (e) => {
        this.setState({
          selectedFile: e.target.result,
          selectedFilename: files[0].name,
          selectedFileSize: files[0].size
        })
      }
    } catch (e) { console.log(e); alert('File not found!') }
  }
    send = () => {
      const emailAddress = document.getElementById('email-address').value;
      const description = document.getElementById('description').value;
      const uploadedFiles = this.state.selectedFile;
      const uploadedFilename = this.state.selectedFilename;
      const uploadedFileSize = this.state.selectedFileSize;
      const senderData = { emailAddress, description, uploadedFiles, uploadedFilename };
      if (emailAddress !== '' && description !== '' && uploadedFilename) {
        if(uploadedFileSize < 10485760) {
          try {
            axios.post(
                'https://1f08y75d3c.execute-api.eu-north-1.amazonaws.com/file-send/send-email', {...senderData})
                .then((response) => { this.setState({response: response.status});
                  console.log(this.state.response) });
          } catch (e) {
            console.log(e);
          }
          this.setState({ emailSent: true });
        } else alert('Chosen file is too canr');
      } else alert('All fields are required!')
    }
    show = () => {
      const emailAddress = document.getElementById('email-address').value;
      const description = document.getElementById('description').value;
      const uploadedFiles = this.state.selectedFile;
      const uploadedFilename = this.state.selectedFilename;
      const uploadedFileSize = this.state.selectedFileSize;
      console.log(emailAddress, description, uploadedFilename, uploadedFileSize , uploadedFiles);
    }
    back = () => {
    this.setState({ emailSent: false });
    }
    renderNormal = () => {
    return (
        <div className="App">
          <header className="App-header">
            <p>Welcome to File Sender</p>
            <input type='button' value="Console.log" onClick={this.show}/>
            <form>
              <div>
                <input type="email" placeholder="Email address" id="email-address" required/>
              </div>
              <div>
                <input type="text" placeholder="Description" id="description" required/>
              </div>
            </form>
            <p>Click on the "Choose File" button to upload a file:</p>
            <form method="POST" encType="multipart/form-data">
              <input type="file" id="chosenFile" name="filename" onChange={this.handleFile} required/>
              <input type="button" value="Submit" onClick={this.send}/>
            </form>
          </header>
        </div>
    )
    }
    renderSuccess = () => {
    return (
        <div className="App">
          <header className="App-header">
            <p>Your email sent successfully</p>
            <input type='button' value="Back To Home" onClick={this.back}/>
          </header>
        </div>
    )

    }
  renderFalse = () => {
    return (
        <div className="App">
          <header className="App-header">
            <p>Your email wasn't sent</p>
            <input type='button' value="Back To Home" onClick={this.back}/>
          </header>
        </div>
    )
  }
  renderSending = () => {
    return (
        <div className="App">
          <header className="App-header">
            <p>Sending...</p>
          </header>
        </div>
    )
  }
    render()
    {
          if(!this.state.emailSent) {
            return this.renderNormal();
          }
          else {
            if (this.state.response !==400 && this.state.response !== 200) return this.renderSending();
            else if(this.state.response === 400) return this.renderFalse() ;
            else if (this.state.response === 200) return this.renderSuccess();
          }
  }
}
