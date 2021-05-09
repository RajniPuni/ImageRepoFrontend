import { Component } from "react";
import loading from "./loading.gif"
import axios from "axios";

class UploadImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          photos: [],
          selectedFile: '',
          isLoading: false,
          errorMessage: '',
          imagedesc:''
        };
    
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
        this.textHandler = this.textHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentWillMount(){
        this.getphotos();     
    }
    
    handleSubmit(event) { 
        event.preventDefault();
        if (this.state.selectedFile!==""){
            this.setState({
              errorMessage: ""                    
            });
            
            this.fileUploadHandler();}
        else{
            this.setState({
              errorMessage: "Please select a photo to upload."                    
          });
        }
    }
    fileSelectedHandler = event => {
        this.setState({selectedFile: event.target.files[0]})
    } 
    textHandler = event => {
        this.setState({imagedesc: event.target.value})
    }
    async fileUploadHandler() {
        this.setState({isLoading: true});
        const fd = new FormData();
        fd.append('imagetoupload',this.state.selectedFile)
        fd.append('userId',1)
        fd.append('imagedesc',this.state.imagedesc)
        
        await axios.post("http://localhost:4000/api/saveimage",fd)
            .then( res=>{
                document.getElementById("myFile").value = ""; 
                this.setState({errorMessage:""})
                this.setState({selectedFile:""})
                alert("Photo submitted Successfully")
                this.getphotos();   
            })
            .catch(error => {
                console.log(error.body);
                this.setState({
                    errorMessage: "Error uploading photos."                    
            });
        });   
        this.setState({isLoading: false});
    }
    showMessage = () => {
        if (this.state.errorMessage) {
            return (
             <div className="alert alert-danger" role="alert">
               {this.state.errorMessage}
             </div>             
            );        
        } else {
            return (<div></div>);
        }
    }
    async getphotos(){
        const { data:photos } = await axios.get("http://localhost:4000/api/saveimage/1");
        this.setState({photos: photos}); 
    }

    render() {
        return(
            <section>
            <div>
                <h3>Add Images</h3>
                <div>
                {
                    this.showMessage()
                }
                </div>
                <form onSubmit={this.handleSubmit}>
                    <div class="imgdet">
                        <span>Select image: </span><input type="file" id="myFile"  name="customFile" onChange={this.fileSelectedHandler} />
                    </div>
                    <div class="imgdet">
                        <span class="imgdesc">Description: </span><input type="text" id="imagedesc"  name="customText" onChange={this.textHandler} />
                    </div>
                    <div>
                        <button >Submit</button> 
                        {this.state.isLoading?<img alt="Loading" src={loading}></img>:<div></div>}            
                    </div>                    
                </form>
                <div class="image-list" >
                    {this.state.photos.map((photo)=>(
                        <div class="card">
                            <div class="card-left">
                                <a href={`http://localhost:4000/uploads/${photo.imageName}`} >                            
                                    <img src={`http://localhost:4000/uploads/${photo.imageName}`} class="image-card" alt="" />
                                </a>
                            </div>
                            <div class="card-right">
                                <p>{photo.imageDesc}</p>
                            </div>
                        </div>
                    
                    ))}
                </div>
            </div>

            </section>
        )
    }
}

export default UploadImage;