import { useEffect, useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { FaEllipsisV } from 'react-icons/fa';
import "./assets/stylesheets/testimonials.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { BASE_URL } from './baseUrl';
export default function Testimonial() {
    const [showModal, setShowModal] = useState(false);
    const [files, setFiles] = useState([]);
    const [userName, setUserName] = useState();
    const [testimonial, setTestimonial] = useState();
    const [EditModal, setEditModal] = useState(false);
    const [testimonials, setTestimonials] = useState([]);
    const [activeTestimonialId, setActiveTestimonialId] = useState(null);
    const [editTestimonialId, setEditTestimonialId] = useState(null);
    const handleOpen = () => {
        setUserName("")
        setFiles([])
        setTestimonial("")
        setShowModal(true)
    };

    useEffect(()=>{
        gettestimonials();
    },[])

const gettestimonials=async()=>{
    try{
let response=await axios.get(`${BASE_URL}/get-testimonials`)
setTestimonials(response?.data?.testimonialData)
console.log(response.data)
    }catch(error){
        if(error?.response && error?.response?.data){
            toast.error(error?.response?.data?.error)
        }else{
        toast.error("Server error please try again")
            
        }
    }
}

    const handleClose = () => {
        setShowModal(false);

    };
    const onDrop = (acceptedFiles) => {
        setFiles(acceptedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleUpload = async(e) => {

        
if(!files[0]){
    toast.error("Please upload a picture")
    return false;
}else if(userName?.length==0 || !userName){
    toast.error("Please enter title")
   
    return false;
}else if(testimonial?.length==0 || !testimonial){
    toast.error("Please enter testimonial")
  
    return false;
}

        const newTestimonial = {
            id: Date.now(), 
            image: URL.createObjectURL(files[0]),
            name:userName,
            testimonial,

        };

try{
    let formdata=new FormData();
    formdata.append('name',userName)
    formdata.append('testimonial',testimonial)
    formdata.append('image',files[0])
let response=await axios.post(`${BASE_URL}/create-testimonial`,formdata)
toast.success(response.data.message)
setTestimonials([...testimonials, newTestimonial])
   handleClose();
   window.location.reload(true)
}catch(error){
if(error?.response && error?.response?.data){
    toast.error(error?.response?.data?.error)
}else{
    toast.error("Server error please try again")
}
}

      

     
    };
    const toggleMenu = (id) => {
        if (activeTestimonialId === id) {
            setActiveTestimonialId(null);
        } else {
            setActiveTestimonialId(id);
        }
    };
    const deleteTestimonial = async(id) => {
        console.log(id)
try{
let response=await axios.delete(`${BASE_URL}/delete-testimonial/${id}`)
toast.success(response?.data?.message)
const filteredarray = testimonials.filter(testimonial => testimonial._id != id);
setTestimonials(filteredarray);
}catch(error){
    if(error?.response && error?.response?.data){
        toast.error(error?.response?.data?.error)
        }else{
        toast.error("Server error please try again")
        
        }
}


    }
    const openEditModal = (id) => {

        const testimonialToEdit = testimonials.find((testimonial) => testimonial._id === id);
        setUserName(testimonialToEdit.name);
        setTestimonial(testimonialToEdit.testimonial);
        setFiles([]);
        setEditTestimonialId(id);
        setEditModal(true);
    };
    const handleEditClose = () => {
        setEditModal(false)
    }
    const handleUpdate =async () => {

        if(!files[0] && EditModal==false){
            toast.error("Please upload a picture")
            return false;
        }else if(userName?.length==0 || !userName && EditModal==false){
            toast.error("Please enter title")
           
            return false;
        }else if(testimonial?.length==0 || !testimonial && EditModal==false){
            toast.error("Please enter testimonial")
            return false;
        }
        
       
        const updatedTestimonial = {
            id: editTestimonialId,
            image: files.length > 0 ? URL.createObjectURL(files[0]) : testimonials.find(t => t._id === editTestimonialId)?.image,
            name:userName,
            testimonial,
        };
        const testimonialIndex = testimonials.findIndex((t) => t._id === editTestimonialId);
        if (testimonialIndex !== -1) {      
            const updatedTestimonials = [...testimonials];
            updatedTestimonials[testimonialIndex] = updatedTestimonial; 
            try{
                let formdata=new FormData();
                formdata.append('name',userName)
                formdata.append("image",files[0])
                formdata.append("testimonial",testimonial)
                formdata.append('id',editTestimonialId)
             let response=await axios.post(`${BASE_URL}/edit-testimonial`,formdata)
             setTestimonials(updatedTestimonials);
             handleEditClose();
            }catch(error){
                if(error?.response && error?.response?.data){
                    toast.error(error?.response?.data?.error)
                    }else{
                    toast.error("Server error please try again")
                    
                    }
            }
          
        } else {
            console.error(`Testimonial with id ${editTestimonialId} not found.`);
        }
    };
    return (
        <div className="w-full flex flex-col gap-[20px] px-[20px]">
         <ToastContainer/>
            <div className="flex w-full justify-end items-center">
                <span
                    className="py-[10px] px-[20px] rounded-[10px] text-white bg-[#F33] hover:cursor-pointer"
                    onClick={handleOpen}
                >
                    + Add New
                </span>

            </div>
            <div className='testimonials'>
                {testimonials?.length > 0 && testimonials?.map((testimonial) => (
                    <div key={testimonial?._id} className='card shadow-md'>
                        <div className='flex flex-col'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-[10px]'>
                                    <img src={testimonial?.image} className="w-[70px] h-[70px] rounded-[100%]" alt="User" />
                                    <div className='flex flex-col'>
                                        <p className='text-[16px] m-0 font-sfPro'>{testimonial?.name}</p>
                                        <div className='flex items-center gap-[4px]'>
                                            {[...Array(5)].map((_, index) => (
                                                <svg key={index} width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M15.2648 11.932C15.0489 12.1412 14.9498 12.4437 14.9989 12.7404L15.7398 16.8404C15.8023 17.1879 15.6556 17.5395 15.3648 17.7404C15.0798 17.9487 14.7006 17.9737 14.3898 17.807L10.6989 15.882C10.5706 15.8137 10.4281 15.777 10.2823 15.7729H10.0564C9.97809 15.7845 9.90142 15.8095 9.83142 15.8479L6.13975 17.782C5.95725 17.8737 5.75059 17.9062 5.54809 17.8737C5.05475 17.7804 4.72559 17.3104 4.80642 16.8145L5.54809 12.7145C5.59725 12.4154 5.49809 12.1112 5.28225 11.8987L2.27309 8.98203C2.02142 8.73786 1.93392 8.3712 2.04892 8.04036C2.16059 7.71036 2.44559 7.46953 2.78975 7.41536L6.93142 6.81453C7.24642 6.78203 7.52309 6.59036 7.66475 6.30703L9.48975 2.56536C9.53309 2.48203 9.58892 2.40536 9.65642 2.34036L9.73142 2.28203C9.77059 2.2387 9.81559 2.20286 9.86559 2.1737L9.95642 2.14036L10.0981 2.08203H10.4489C10.7623 2.11453 11.0381 2.30203 11.1823 2.58203L13.0314 6.30703C13.1648 6.57953 13.4239 6.7687 13.7231 6.81453L17.8648 7.41536C18.2148 7.46536 18.5073 7.70703 18.6231 8.04036C18.7323 8.37453 18.6381 8.7412 18.3814 8.98203L15.2648 11.932Z" fill="#FFB900" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className='flex justify-end items-center'>
                                    <div onClick={() => toggleMenu(testimonial?._id)} className="relative hover:cursor-pointer bg-white rounded-[100%] w-[30px] h-[30px] flex items-center justify-center">
                                        <FaEllipsisV />
                                        {activeTestimonialId === testimonial?._id && (
                                            <div className="video-menu">
                                                <p className="options" onClick={() => openEditModal(testimonial?._id)}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M13.748 20.4438H21.0006" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M12.78 3.79479C13.5557 2.86779 14.95 2.73186 15.8962 3.49173C15.9485 3.53296 17.6295 4.83879 17.6295 4.83879C18.669 5.46719 18.992 6.80311 18.3494 7.82259C18.3153 7.87718 8.81195 19.7645 8.81195 19.7645C8.49578 20.1589 8.01583 20.3918 7.50291 20.3973L3.86353 20.443L3.04353 16.9723C2.92866 16.4843 3.04353 15.9718 3.36283 15.5736L12.78 3.79479Z" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M11.0684 6.39594L16.9244 10.6599" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    Edit
                                                </p>
                                                <p className="options" onClick={() => deleteTestimonial(testimonial?._id)}>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M20.207 9.37894C20.207 9.37894 19.682 15.2319 19.409 17.7719C19.284 18.9729 18.627 19.5959 17.412 19.6169C14.924 19.6619 12.434 19.6649 9.94704 19.6119C8.76804 19.5879 8.12404 18.9589 8.00204 17.7719C7.72804 15.2219 7.20504 9.37894 7.20504 9.37894" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M21.0001 6.23919H5.41309" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M17.4404 6.23906C16.6554 6.23906 15.9734 5.68906 15.8244 4.91606L15.5824 3.68906C15.4574 3.11106 14.9264 2.71006 14.3334 2.71006H12.0794C11.4864 2.71006 10.9554 3.11106 10.8314 3.68906L10.5894 4.91606C10.4404 5.68906 9.75843 6.23906 8.97343 6.23906" stroke="#0E0E0E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    Delete
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </span>
                            </div>
                            <p className='mt-[20px]'>{testimonial.testimonial}</p>
                        </div>
                    </div>
                ))}
            </div>
            <Modal show={showModal} onHide={handleClose}>
                <p className="justify-center text-[#f33] text-center py-[20px] m-0 text-[26px] font-bold font-sfPro">Add testimonial</p>
                <p className="justify-center text-center text-[16px] font-sfPro">Add and manage testimonial</p>
                <Modal.Body>
                    <div {...getRootProps({ className: 'dropzone' })} className="border border-dashed border-gray-400 p-4 rounded-[10px] text-center mb-4">
                        <input {...getInputProps()} />
                        <p className="media-guide hover:cursor-pointer">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.38948 8.98452H6.45648C4.42148 8.98452 2.77148 10.6345 2.77148 12.6695V17.5445C2.77148 19.5785 4.42148 21.2285 6.45648 21.2285H17.5865C19.6215 21.2285 21.2715 19.5785 21.2715 17.5445V12.6595C21.2715 10.6305 19.6265 8.98452 17.5975 8.98452L16.6545 8.98452" stroke="#130F26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12.0215 2.19142V14.2324" stroke="#130F26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M9.10645 5.11914L12.0214 2.19114L14.9374 5.11914" stroke="#130F26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            Upload Picture
                        </p>
                        {files.length > 0 && (
                            <div>
                                <h4>Selected files:</h4>
                                <ul>
                                    {files.map(file => (
                                        <li key={file.path}>{file.path} - {file.size} bytes</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <Form>
                        <Form.Group className="mb-3" controlId="formVideoTitle">
                            <Form.Label className="text-[16px] font-sfPro">Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Write Name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formParagraph">
                            <Form.Label className="text-[16px] font-sfPro">Testimonial</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Write Testimonial"
                                value={testimonial}
                                onChange={(e) => setTestimonial(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <span
                        className="bg-[#F33] cursor-pointer text-white rounded-[10px] w-full py-[17px] px-[8px] flex items-center justify-center"
                        onClick={handleUpload}
                    >
                        Add
                    </span>
                </Modal.Footer>
            </Modal>

            {/* edit modal */}
            <Modal show={EditModal} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Article</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div {...getRootProps({ className: 'dropzone' })} className="border border-dashed border-gray-400 p-4 rounded-[10px] text-center mb-4">
                        <input {...getInputProps()} />
                        <p className="media-guide hover:cursor-pointer">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.38948 8.98452H6.45648C4.42148 8.98452 2.77148 10.6345 2.77148 12.6695V17.5445C2.77148 19.5785 4.42148 21.2285 6.45648 21.2285H17.5865C19.6215 21.2285 21.2715 19.5785 21.2715 17.5445V12.6595C21.2715 10.6305 19.6265 8.98452 17.5975 8.98452L16.6545 8.98452" stroke="#130F26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12.0215 2.19142V14.2324" stroke="#130F26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M9.10645 5.11914L12.0214 2.19114L14.9374 5.11914" stroke="#130F26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            Upload Picture
                        </p>
                        {files.length > 0 && (
                            <div>
                                <h4>Selected files:</h4>
                                <ul>
                                    {files.map(file => (
                                        <li key={file.path}>{file.path} - {file.size} bytes</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <Form>
                        <Form.Group controlId="formEditName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" value={userName} onChange={(e) => setUserName(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formEditTestimonial">
                            <Form.Label>Testimonial</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Enter testimonial" value={testimonial} onChange={(e) => setTestimonial(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="edit-article" onClick={handleUpdate}>
                        Update article
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}