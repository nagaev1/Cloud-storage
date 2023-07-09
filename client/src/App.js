import './App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';




import folderBrown from './images/folder-brown.ico';
import cog from './images/cog.ico';
import symLink from './images/emblem-symbolic-link.ico';
import textFile from './images/x-office-document.ico';
import isoFile from './images/CD.ico';
import officeFile from './images/applications-office.ico';
import zipFile from './images/application-zip.ico';
import scriptFile from './images/application-x-shellscript.ico';
import imgFile from './images/image-bmp.ico'
import videoFile from './images/video-mp4.ico'
import exeFile from './images/applications-development.ico'








class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onClick: this.props.onClick,
      onInput: this.props.onInput,
      onSubmit: this.props.onSubmit,
      searchPath: this.props.searchPath,
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
  }


  handleClick () {
    (async () => {
      this.state.onClick()
    })().then(() => {
      if (this.state.searchPath !== this.props.searchPath) this.setState({ searchPath: this.props.searchPath })
    })
  }

  componentDidUpdate(){
    if (this.state.searchPath !== this.props.searchPath) this.setState({ searchPath: this.props.searchPath })
  }

  handleSearchSubmit(e) {
    e.preventDefault()
    this.state.onSubmit(e)
  }


  render() {
    return(
      <nav className='flex-justify-between flex-align-center flex-wrap'>
        <ul className='list-none flex-justify-center'>
          <li><button onClick={this.handleClick}>Наверх</button></li>
          <li><button onClick={this.handleClick}>Наверх</button></li>
          <li><button onClick={this.handleClick}>Наверх</button></li>
        </ul>
        <form onSubmit={this.handleSearchSubmit}>
          <input type='text' value={this.state.searchPath} onInput={this.state.onInput}/>
          <button onClick={this.handleSearchSubmit}>найти</button>
        </form>
        <input type="text" className="" placeholder='Поиск' />
      </nav>
    )
  }
}

class FileBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: props.file,
      onClick: props.onClick
    }
    this.selectImage = this.selectImage.bind(this)
  }


  componentDidUpdate () {
    if (this.state.file !== this.props.file) this.setState({ file: this.props.file })
  }

  selectImage() {
    const data = this.state.file.split('.')
    let type
    if (data.length === 1){
      type = 'repos'
    } else type = data.pop()
    switch (type) {
      case 'repos':
        return folderBrown
      case 'lnk': case 'url':

        return symLink
      case 'txt':
        return textFile
      case 'iso':
        return isoFile
      case 'docx':
        return officeFile
      case 'zip': case 'rar':
        return zipFile
      case 'css':  case 'html':  case 'js':  case 'jsx':  case 'json':  case 'cpp':  case 'cs':  case 'csx':  case 'py':  case 'rs':  case 'php':
        return scriptFile
      case 'png': case 'jpg': case 'jpeg':case 'bmp': case 'gif': case 'svg': case 'ico':
        return imgFile
      case 'mp4': case 'mkv': case 'avi': case 'mpg': case 'mpeg':
        return videoFile
      case 'exe':
        return exeFile
      default:
        return cog
    }
  }

  typeOfFile(){
    console.log(this.state.file.split('.').pop());
   // const newPath = this.state.path.split( '/' ).slice( 0, -1 ).join( '/' );
  }

  render() {
    return(
      <div className="block"
      onClick={() => this.state.onClick(this.state.file)}
      onContextMenu={() => {console.log('правый клик')}}
      >
        <img src={this.selectImage()} alt="Icon" />


        <p>{this.state.file.toString()}</p>
      </div>
    )
  }
}


class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: props.files,
      onClick: props.onClick   
    }
  }

  componentDidUpdate () {
    if (this.state.files !== this.props.files) this.setState({ files: this.props.files })
  }
  render() {
    return (
      <div className="flex-wrap flex-align-center flex-justify-center">
        {this.state.files.map((file, index) => {
          return (
            <FileBlock file={file} key={index} onClick={this.state.onClick} />
          )
        })}
      </div>
    )
  }

}




class App extends React.Component {
  constructor (props){
    super(props)
    this.state = {
      path: 'C:/Users/Zhe/Desktop/учёбка/react/УПФ/client/',
      searchPath: 'C:/Users/Zhe/Desktop/учёбка/react/УПФ/client/',
      files: []
    }
    this.handleUpFolder = this.handleUpFolder.bind(this)
    this.handleBlockClick = this.handleBlockClick.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
  }


  handleUpFolder(){
    console.log('поднятие на папку вверх');
    const newPath = this.state.path.split( '/' ).slice( 0, -2 ).join( '/' ) + '/';
    this.getFiles(newPath)
  }

  handleBlockClick(file) {
    const newPath = this.state.path + file + '/'
    this.getFiles(newPath)
  }

  handleInput(e) {
    this.setState({ searchPath: e.target.value});
  }

  handleSearchSubmit (e){
    this.getFiles(this.state.searchPath)
  }

  getFiles(path){
    if (path[path.length - 1] !== '/') path += '/'
    console.log('Запрос на ' + path);
    axios.get('http://192.168.0.44:5000', {
      params: {
        path: path
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        withCredentials: true,
        mode: 'no-cors',
        'ngrok-skip-browser-warning':true
      }
  })
      .then(res => {
        if (!res) return console.eror('запрос не получен'); 
        console.log('запрос получен');
        console.log(res);
        switch (res.data.type) {
          case 'fileData':
              console.log(res.data.file);
            break;
          
          case 'files':
            this.setState({files: res.data.files, path, searchPath: path});
            break;
            
          default:
            console.log('тип неопределен ', res.data.type);
            break;
        }
        
      })
      .catch(err => {
        console.log( 'что-то пошло не так', err)
      });
  }

  componentDidMount() {
    this.getFiles(this.state.path)    
  }

  render() {
    return(
      <div className="App">
        <Nav onClick={this.handleUpFolder} searchPath={this.state.searchPath} onInput={this.handleInput} onSubmit={this.handleSearchSubmit} />
        <List  files={this.state.files} onClick={this.handleBlockClick} />
      </div>
    )
  }
}

export default App;
