import './assets/stylesheets/manage-videos.css';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Modal, Form } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { FaEllipsisV } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BASE_URL } from './baseUrl';

export default function ManageVideos() {
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [videos, setVideos] = useState([]);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [editVideoId, setEditVideoId] = useState(null);
  const [playVideo, setPlayVideo] = useState(false);
  const [selectedOption, setSelectedOption] = useState('link'); // default to 'link'
  const [isfeatured, setIsFeatured] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsFeatured(e.target.checked);
  };
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const handleClose = () => {
    setShowModal(false);
    setFiles([]);
    setTitle('');
    setDescription('');
  };

  const handleShow = () => {
    setFiles([]);
    setTitle('');
    setDescription('');
    setShowModal(true);
  };

  const handleUpload = async () => {
    if (
      selectedOption === 'upload' &&
      files?.length == 0 &&
      editModalOpen == false
    ) {
      toast.error('Please select a video');
      return false;
    } else if (title?.length == 0 && editModalOpen == false) {
      toast.error('Please enter title');
      return false;
    } else if (description?.length == 0 && editModalOpen == false) {
      toast.error('Please provide description');
      return false;
    }
    if (selectedOption === 'upload') {
      const newVideo = {
        video: files[0],
        title,
        description,
      };
      let formdata = new FormData();
      formdata.append('video', newVideo.video);
      formdata.append('title', newVideo.title);
      formdata.append('description', newVideo.description);
      formdata.append('isfeatured', isfeatured);

      try {
        let response = await axios.post(`${BASE_URL}/create-video`, formdata);
        console.log(response);
        let { videoget } = response.data;
        toast.success('Video uploaded successfully');
        newVideo.video = videoget.video;
        setVideos([...videos, newVideo]);
        window.location.reload(true);
        handleClose();
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.error);
        } else {
          console.error('Error:', error.message);
          toast.error('Server error. Please try again.');
        }
      }
    } else {
      try {
        let response = await axios.post(`${BASE_URL}/create-video-link`, {
          link,
          type: selectedOption,
          title,
          description,
          isfeatured,
        });

        let { videoget } = response.data;
        toast.success('Video uploaded successfully');

        setVideos([...videos, videoget.video]);
        window.location.reload(true);
        handleClose();
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.error);
        } else {
          console.error('Error:', error.message);
          toast.error('Server error. Please try again.');
        }
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: 'video/*',
  });
  const toggleMenu = (videoId) => {
    if (activeVideoId === videoId) {
      setActiveVideoId(null);
    } else {
      setActiveVideoId(videoId);
    }
  };
  const playPauseVideo = (videoId) => {
    const videoElement = document.getElementById(`video-${videoId}`);
    if (videoElement.paused) {
      videoElement.play();
      setPlayVideo(true);
    } else {
      videoElement.pause();
      setPlayVideo(false);
    }
  };
  const deleteVideo = async (vidid) => {
    const filter = videos.filter((vid) => vid?._id != vidid);
    try {
      let response = await axios.delete(`${BASE_URL}/delete-video/${vidid}`);
      toast.success('Video deleted sucessfully');
      setVideos(filter);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(error);
        toast.error(error.response.data.error);
      } else {
        console.error('Error:', error.message);
        toast.error('Server error. Please try again.');
      }
    }
  };
  const openEditModal = (videoId) => {
    const videoToEdit = videos.find((vid) => vid?._id === videoId);
    if (videoToEdit) {
      setTitle(videoToEdit.title);
      setLink(videoToEdit.link);
      setDescription(videoToEdit.description);
      setEditVideoId(videoId);
      setEditModalOpen(true);
    }
  };

  const saveEditedVideo = async () => {
    try {
      let formdata = new FormData();
      formdata.append('id', editVideoId);
      formdata.append('description', description);
      formdata.append('title', title);
      formdata.append('link', link);
      formdata.append('type', selectedOption);
      formdata.append('isfeatured', isfeatured);

      if (files.length > 0) {
        formdata.append('video', files[0]);
      }

      let response = await axios.post(`${BASE_URL}/editVideo`, formdata);
      const updatedVideos = videos.map((vid) => {
        if (vid._id === editVideoId) {
          console.log('VIDEO');
          console.log(files.length > 0 ? files[0] : vid.video);
          return {
            ...vid,
            video: files.length > 0 ? response.data.videodata.video : vid.video,
            title,
            type: selectedOption,
            description,
            isfeatured,
          };
        }
        debugger;
        return vid;
      });

      setVideos(updatedVideos);
      console.log(updatedVideos);
      console.log('UPDATED VIDEOS');
      console.log(response.data);
      setEditModalOpen(false);
      toast.success('Video edited successfully');
      window.location.reload(true);
    } catch (error) {
      if (error?.response && error?.response?.data) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error('Server error. Please try again.');
      }
    }
  };

  useEffect(() => {
    const videosd = videos;
    console.log('these are', videosd);
  }, [videos]);
  React.useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    let response = await axios.get(`${BASE_URL}/getVideos`);
    console.log(response.data);
    setVideos(response?.data?.videos);
  };

  return (
    <div className='flex w-full flex-col gap-[20px] px-[20px]'>
      <ToastContainer />
      <div className='flex justify-between items-center mt-[30px]'>
        <h2 className='text-[18px] font-[500]'>Pinned list</h2>
        <span
          className='py-[10px] px-[20px] rounded-[10px] text-white bg-[#F33] hover:cursor-pointer'
          onClick={handleShow}>
          + New Video
        </span>
      </div>
      <div className='videos flex flex-wrap gap-[20px]'>
        {videos?.map((video) => (
          <React.Fragment key={video?._id}>
            <div className='video-card relative w-full  overflow-hidden'>
              <div className='relative w-full'>
                {video?.type === 'upload' ? (
                  <video
                    id={`video-${video?._id}`}
                    className='border  rounded-[12px] w-full h-[200px] object-cover rounded-t-[12px]'>
                    <source src={video?.video} />
                    Your browser does not support the video tag.
                  </video>
                ) : video?.type === 'link' ? (
                  <ReactPlayer
                    className='react-player'
                    url={video?.video}
                    width='100%'
                    height='200px'
                  />
                ) : (
                  <div className='border  rounded-[12px] w-full h-[200px] object-cover rounded-t-[12px]'>
                    <div dangerouslySetInnerHTML={{ __html: video?.video }} />
                  </div>
                )}
                {video?.type === 'upload' ? (
                  <span
                    onClick={() => playPauseVideo(video?._id)}
                    className='play-btn w-[40px] h-[40px] rounded-[100%] flex justify-center items-center absolute top-[50%] left-[50%]'>
                    {playVideo ? (
                      <svg
                        width='29'
                        height='29'
                        viewBox='0 0 29 29'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M9.5 7H11.5V21H9.5V7Z'
                          fill='none'
                          stroke='white'
                          stroke-width='2'
                        />
                        <path
                          d='M17.5 7H19.5V21H17.5V7Z'
                          fill='none'
                          stroke='white'
                          stroke-width='2'
                        />
                      </svg>
                    ) : (
                      <svg
                        width='29'
                        height='29'
                        viewBox='0 0 29 29'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                          fill-rule='evenodd'
                          clip-rule='evenodd'
                          d='M14.335 1C21.6986 1 27.67 6.97008 27.67 14.335C27.67 21.6999 21.6986 27.67 14.335 27.67C6.97008 27.67 1 21.6999 1 14.335C1 6.97008 6.97008 1 14.335 1Z'
                          stroke='white'
                          stroke-width='1.5'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                        <path
                          fill-rule='evenodd'
                          clip-rule='evenodd'
                          d='M18.5458 14.3292C18.5458 13.1907 12.71 9.54825 12.048 10.2032C11.386 10.8581 11.3223 17.7387 12.048 18.4553C12.7736 19.1745 18.5458 15.4678 18.5458 14.3292Z'
                          stroke='white'
                          stroke-width='1.5'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                    )}
                  </span>
                ) : null}
              </div>
              <div className='p-[10px]'>
                <h3 className='text-[18px] font-[500]'>{video?.title}</h3>
                <p className='text-[16px]'>{video?.description}</p>
              </div>
              <div
                onClick={() => toggleMenu(video?._id)}
                className='absolute top-[10px] right-[10px] hover:cursor-pointer bg-white rounded-[100%] w-[30px] h-[30px] flex items-center justify-center'>
                <svg
                  width='4'
                  height='18'
                  viewBox='0 0 4 18'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M2 4C2.39556 4 2.78224 3.8827 3.11114 3.66294C3.44004 3.44317 3.69638 3.13082 3.84776 2.76537C3.99913 2.39991 4.03874 1.99778 3.96157 1.60982C3.8844 1.22186 3.69392 0.865492 3.41421 0.585787C3.13451 0.306082 2.77814 0.115601 2.39018 0.0384303C2.00222 -0.0387401 1.60009 0.000866562 1.23463 0.152242C0.869182 0.303617 0.556825 0.559962 0.337062 0.88886C0.117299 1.21776 1.07779e-06 1.60444 1.07779e-06 2C1.07779e-06 2.53043 0.210715 3.03914 0.585788 3.41421C0.96086 3.78928 1.46957 4 2 4ZM2 14C1.60444 14 1.21776 14.1173 0.88886 14.3371C0.559962 14.5568 0.303617 14.8692 0.152242 15.2346C0.000866562 15.6001 -0.0387401 16.0022 0.0384303 16.3902C0.115601 16.7781 0.306083 17.1345 0.585788 17.4142C0.865492 17.6939 1.22186 17.8844 1.60982 17.9616C1.99778 18.0387 2.39991 17.9991 2.76537 17.8477C3.13082 17.6964 3.44318 17.44 3.66294 17.1111C3.8827 16.7822 4 16.3956 4 16C4 15.4696 3.78928 14.9609 3.41421 14.5858C3.03914 14.2107 2.53043 14 2 14ZM2 7C1.60444 7 1.21776 7.11729 0.88886 7.33706C0.559962 7.55682 0.303617 7.86918 0.152242 8.23463C0.000866562 8.60008 -0.0387401 9.00221 0.0384303 9.39018C0.115601 9.77814 0.306083 10.1345 0.585788 10.4142C0.865492 10.6939 1.22186 10.8844 1.60982 10.9616C1.99778 11.0387 2.39991 10.9991 2.76537 10.8478C3.13082 10.6964 3.44318 10.44 3.66294 10.1111C3.8827 9.78224 4 9.39556 4 9C4 8.46956 3.78928 7.96086 3.41421 7.58578C3.03914 7.21071 2.53043 7 2 7Z'
                    fill='black'
                  />
                </svg>
                {activeVideoId === video?._id && (
                  <div className='video-menu'>
                    <p
                      onClick={(e) => {
                        navigator.clipboard.writeText(video?.video);
                        toast.success('Video clipped sucessfully');
                      }}
                      className='options'>
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M13 2L3 14H12L11 22L21 10H12L13 2Z'
                          stroke='#0E0E0E'
                          stroke-width='1.6'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                      Pinn
                    </p>
                    <p
                      className='options'
                      onClick={() => openEditModal(video?._id)}>
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M13.748 20.4438H21.0006'
                          stroke='#0E0E0E'
                          stroke-width='1.5'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                        <path
                          fill-rule='evenodd'
                          clip-rule='evenodd'
                          d='M12.78 3.79479C13.5557 2.86779 14.95 2.73186 15.8962 3.49173C15.9485 3.53296 17.6295 4.83879 17.6295 4.83879C18.669 5.46719 18.992 6.80311 18.3494 7.82259C18.3153 7.87718 8.81195 19.7645 8.81195 19.7645C8.49578 20.1589 8.01583 20.3918 7.50291 20.3973L3.86353 20.443L3.04353 16.9723C2.92866 16.4843 3.04353 15.9718 3.3597 15.5773L12.78 3.79479Z'
                          stroke='#0E0E0E'
                          stroke-width='1.5'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                        <path
                          d='M11.0215 6L16.4737 10.1871'
                          stroke='#0E0E0E'
                          stroke-width='1.5'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                      Edit
                    </p>
                    <p
                      className='options'
                      onClick={() => deleteVideo(video?._id)}>
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M19.3238 9.4668C19.3238 9.4668 18.7808 16.2018 18.4658 19.0388C18.3158 20.3938 17.4788 21.1878 16.1078 21.2128C13.4988 21.2598 10.8868 21.2628 8.27881 21.2078C6.95981 21.1808 6.13681 20.3768 5.98981 19.0458C5.67281 16.1838 5.13281 9.4668 5.13281 9.4668'
                          stroke='#0E0E0E'
                          stroke-width='1.5'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                        <path
                          d='M20.708 6.23828H3.75'
                          stroke='#0E0E0E'
                          stroke-width='1.5'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                        <path
                          d='M17.4406 6.239C16.6556 6.239 15.9796 5.684 15.8256 4.915L15.5826 3.699C15.4326 3.138 14.9246 2.75 14.3456 2.75H10.1126C9.53358 2.75 9.02558 3.138 8.87558 3.699L8.63258 4.915C8.47858 5.684 7.80258 6.239 7.01758 6.239'
                          stroke='#0E0E0E'
                          stroke-width='1.5'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                      Delete
                    </p>
                  </div>
                )}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <Modal
        show={showModal}
        onHide={handleClose}>
        <p className='justify-center text-[#f33] text-center py-[20px] m-0 text-[26px] font-bold font-sfPro'>
          Upload New
        </p>
        <p className='justify-center text-center text-[16px] font-sfPro'>
          Upload new video and manage it
        </p>
        <Modal.Body>
          <div className='flex items-center gap-4 mb-4'>
            <div className='flex items-center'>
              <input
                id='default-radio-1'
                type='radio'
                value='upload'
                name='default-radio'
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                checked={selectedOption === 'upload'}
                onChange={handleOptionChange}
              />
              <label
                htmlFor='default-radio-1'
                className='ms-2 text-sm font-medium'>
                Upload
              </label>
            </div>
            <div className='flex items-center'>
              <input
                id='default-radio-2'
                type='radio'
                value='link'
                name='default-radio'
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                checked={selectedOption === 'link'}
                onChange={handleOptionChange}
              />
              <label
                htmlFor='default-radio-2'
                className='ms-2 text-sm font-medium'>
                Link
              </label>
            </div>
            <div className='flex items-center'>
              <input
                id='default-radio-2'
                type='radio'
                value='embed'
                name='default-radio'
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                checked={selectedOption === 'embed'}
                onChange={handleOptionChange}
              />
              <label
                htmlFor='default-radio-2'
                className='ms-2 text-sm font-medium'>
                Embed
              </label>
            </div>
          </div>
          {selectedOption === 'upload' ? (
            <div
              {...getRootProps({ className: 'dropzone' })}
              className='border border-dashed border-gray-400 p-4 rounded-[10px] text-center mb-4'>
              <input {...getInputProps()} />
              <p className='media-guide hover:cursor-pointer'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M7.38948 8.98452H6.45648C4.42148 8.98452 2.77148 10.6345 2.77148 12.6695V17.5445C2.77148 19.5785 4.42148 21.2285 6.45648 21.2285H17.5865C19.6215 21.2285 21.2715 19.5785 21.2715 17.5445V12.6595C21.2715 10.6305 19.6265 8.98452 17.5975 8.98452L16.6545 8.98452'
                    stroke='#130F26'
                    stroke-width='1.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                  <path
                    d='M12.0215 2.19142V14.2324'
                    stroke='#130F26'
                    stroke-width='1.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                  <path
                    d='M9.10645 5.11914L12.0214 2.19114L14.9374 5.11914'
                    stroke='#130F26'
                    stroke-width='1.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
                Upload Video
              </p>
              {files.length > 0 && (
                <div>
                  <h4>Selected files:</h4>
                  <ul>
                    {files.map((file) => (
                      <li key={file.path}>
                        {file.path} - {file.size} bytes
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : selectedOption === 'link' ? (
            <Form>
              <Form.Group
                className='mb-3'
                controlId='formVideoLink'>
                <Form.Label className='text-[16px] font-sfPro'>
                  Video Link
                </Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Video Link'
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </Form.Group>
            </Form>
          ) : (
            <Form>
              <Form.Group
                className='mb-3'
                controlId='formVideoEmbed'>
                <Form.Label className='text-[16px] font-sfPro'>
                  Video Embed
                </Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Video Embed'
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </Form.Group>
            </Form>
          )}
          <Form>
            <Form.Group
              className='mb-3'
              controlId='formVideoTitle'>
              <Form.Label className='text-[16px] font-sfPro'>
                Video Title
              </Form.Label>
              <Form.Control
                type='text'
                placeholder='Write video title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className='mb-3'
              controlId='formVideoDescription'>
              <Form.Label className='text-[16px] font-sfPro'>
                Video Description
              </Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Write video description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <label className='inline-flex items-center cursor-pointer'>
              <span className='me-3'>Is Featured</span>
              <input
                type='checkbox'
                className='sr-only peer'
                onChange={handleCheckboxChange}
                checked={isfeatured}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primaryColor"></div>
            </label>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <span
            className='bg-[#F33] cursor-pointer text-white rounded-[10px] w-full py-[17px] px-[8px] flex items-center justify-center'
            onClick={handleUpload}>
            Upload
          </span>
        </Modal.Footer>
      </Modal>
      {/* Edit Modal */}
      <Modal
        show={editModalOpen}
        onHide={() => setEditModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='flex items-center gap-4 mb-4'>
            <div className='flex items-center'>
              <input
                id='default-radio-1'
                type='radio'
                value='upload'
                name='default-radio'
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                checked={selectedOption === 'upload'}
                onChange={handleOptionChange}
              />
              <label
                htmlFor='default-radio-1'
                className='ms-2 text-sm font-medium'>
                Upload
              </label>
            </div>
            <div className='flex items-center'>
              <input
                id='default-radio-2'
                type='radio'
                value='link'
                name='default-radio'
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                checked={selectedOption === 'link'}
                onChange={handleOptionChange}
              />
              <label
                htmlFor='default-radio-2'
                className='ms-2 text-sm font-medium'>
                Link
              </label>
            </div>
            <div className='flex items-center'>
              <input
                id='default-radio-2'
                type='radio'
                value='embed'
                name='default-radio'
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                checked={selectedOption === 'embed'}
                onChange={handleOptionChange}
              />
              <label
                htmlFor='default-radio-2'
                className='ms-2 text-sm font-medium'>
                Embed
              </label>
            </div>
          </div>
          {selectedOption === 'upload' ? (
            <div
              {...getRootProps({ className: 'dropzone' })}
              className='border border-dashed border-gray-400 p-4 rounded-[10px] text-center mb-4'>
              <input {...getInputProps()} />
              <p className='media-guide hover:cursor-pointer'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M7.38948 8.98452H6.45648C4.42148 8.98452 2.77148 10.6345 2.77148 12.6695V17.5445C2.77148 19.5785 4.42148 21.2285 6.45648 21.2285H17.5865C19.6215 21.2285 21.2715 19.5785 21.2715 17.5445V12.6595C21.2715 10.6305 19.6265 8.98452 17.5975 8.98452L16.6545 8.98452'
                    stroke='#130F26'
                    stroke-width='1.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                  <path
                    d='M12.0215 2.19142V14.2324'
                    stroke='#130F26'
                    stroke-width='1.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                  <path
                    d='M9.10645 5.11914L12.0214 2.19114L14.9374 5.11914'
                    stroke='#130F26'
                    stroke-width='1.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                  />
                </svg>
                Upload Video
              </p>
              {files.length > 0 && (
                <div>
                  <h4>Selected files:</h4>
                  <ul>
                    {files.map((file) => (
                      <li key={file.path}>
                        {file.path} - {file.size} bytes
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : selectedOption === 'link' ? (
            <Form>
              <Form.Group
                className='mb-3'
                controlId='formVideoLink'>
                <Form.Label className='text-[16px] font-sfPro'>
                  Video Link
                </Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Video Link'
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </Form.Group>
            </Form>
          ) : (
            <Form>
              <Form.Group
                className='mb-3'
                controlId='formVideoEmbed'>
                <Form.Label className='text-[16px] font-sfPro'>
                  Video Embed
                </Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Video Embed'
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </Form.Group>
            </Form>
          )}
          <Form>
            <Form.Group
              className='mb-3'
              controlId='formEditVideoTitle'>
              <Form.Label>Video Title</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter video title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className='mb-3'
              controlId='formEditVideoDescription'>
              <Form.Label>Video Description</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Enter video description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <label className='inline-flex items-center cursor-pointer'>
              <span className='me-3'>Is Featured</span>
              <input
                type='checkbox'
                className='sr-only peer'
                onChange={handleCheckboxChange}
                checked={isfeatured}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primaryColor"></div>
            </label>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className='btn btn-secondary'
            onClick={() => setEditModalOpen(false)}>
            Close
          </button>
          <button
            className='btn btn-primary'
            onClick={saveEditedVideo}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
