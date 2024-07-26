import React, { useEffect, useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { FaEllipsisV } from 'react-icons/fa';
import './assets/stylesheets/manage-videos.css';
import axios from 'axios';
import { BASE_URL } from './baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

export default function News() {
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [date, setDate] = useState('');

  const [article, setArticle] = useState([]);
  const [allArticles, setAllArticles] = useState([]); // State for all articles
  const [pinnedArticles, setPinnedArticles] = useState([]); // State for pinned articles
  const [activeImageId, setActiveImageId] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null); // New state for editing article
  const [EditModal, setEditModal] = useState(false);
  const [players, setPlayers] = useState([]);
  const [type, setType] = useState('Top news');
  const handleOpen = () => {
    setTitle('');
    setParagraph('');
    setDate('');
    setFiles([]);
    setShowModal(true);
  };
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [mention, setMention] = useState(
    editingArticle ? editingArticle.mention : ''
  );

  const handleChange = (selectedOptions) => {
    if (selectedOptions.length <= 3) {
      setSelectedPlayers(selectedOptions);
    }
  };

  const playerOptions = players.map((player) => ({
    value: player?._id,
    label: player?.name,
  }));
  const handleClose = () => {
    setShowModal(false);
  };
  useEffect(() => {
    getNewsFeed();
  }, []);

  const getNewsFeed = async () => {
    try {
      let response = await axios.get(`${BASE_URL}/getNewsFeed`);
      let responsePlayer = await axios.get(`${BASE_URL}/getPlayers`);
      console.log(response.data);
      setPlayers(responsePlayer?.data?.players);
      setAllArticles(response.data.news);
    } catch (error) {
      if (error?.response && error?.response?.data) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error('Server error please try again');
      }
    }
  };

  const handleEditClose = () => {
    setEditModal(false);
  };
  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = async () => {
    let featuredPlayers = selectedPlayers.map((val, i) => {
      return val.value;
    });
    if (files?.length == 0 && EditModal == false) {
      toast.error('Please select image');
      return false;
    } else if (title?.length == 0 && EditModal == false) {
      toast.error('Please enter title');
      return false;
    } else if (paragraph?.length == 0 && EditModal == false) {
      toast.error('Please enter description');
      return false;
    } else if (featuredPlayers?.length == 0 && EditModal == false) {
      toast.error('Please mention featured players');
      return false;
    }
    const newArticle = {
      _id: Date.now(), // Assigning a unique id for each article
      banner: URL.createObjectURL(files[0]),
      date,
      title,
      description: paragraph,
      featuredPlayers,
    };
    try {
      let formdata = new FormData();

      formdata.append('banner', files[0]);
      formdata.append('title', newArticle.title);
      formdata.append('description', newArticle.description);
      formdata.append('featuredPlayers', featuredPlayers);
      formdata.append('type', type);
      let response = await axios.post(`${BASE_URL}/create-newsFeed`, formdata);
      toast.success('News feed created');
      setAllArticles([...allArticles, newArticle]);
      handleClose();
      window.location.reload(true);
    } catch (error) {
      if (error?.response && error?.response?.data) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error('Server error please try again');
      }
    }
  };

  const toggleMenu = (id) => {
    if (activeImageId === id) {
      setActiveImageId(null);
    } else {
      setActiveImageId(id);
    }
  };

  const openEditModal = (id) => {
    const articleToEdit =
      allArticles.find((item) => item._id === id) ||
      pinnedArticles.find((item) => item._id === id);
    if (articleToEdit) {
      setEditingArticle(articleToEdit);
      setTitle(articleToEdit.title);
      setParagraph(articleToEdit.description);
      setDate(articleToEdit?.createdAt);
      setType(articleToEdit?.type);
      setMention(articleToEdit.mention);

      let fullFeaturedPlayers = articleToEdit?.featuredPlayers
        .map((featuredPlayerId) => {
          return players.find((player) => player?._id === featuredPlayerId);
        })
        .filter((player) => player); // Filter out any undefined players
      let finalfeaturedPlayers = fullFeaturedPlayers.map((val, i) => {
        return { value: val._id, label: val.name };
      });
      console.log(finalfeaturedPlayers);
      setSelectedPlayers(finalfeaturedPlayers);
      setEditModal(true);
    }
  };

  const handleUpdate = async () => {
    let featuredPlayers = selectedPlayers.map((val, i) => {
      return val.value;
    });
    const updatedArticle = {
      ...editingArticle,
      title,
      image: files[0],
      description: paragraph,
      date,
      featuredPlayers,
    };

    try {
      console.log(featuredPlayers);
      console.log('featuredplayers');
      let formdata = new FormData();
      formdata.append('banner', files[0]);
      formdata.append('title', updatedArticle.title);
      formdata.append('description', updatedArticle.description);
      formdata.append('featuredPlayers', featuredPlayers);
      formdata.append('type', type);
      formdata.append('id', updatedArticle._id);
      let response = await axios.post(`${BASE_URL}/editNewsFeed`, formdata);
      console.log(response.data);
      toast.success('Newsfeed updated successfully');
      const allArticlesIndex = allArticles.findIndex(
        (item) => item._id === editingArticle._id
      );
      const pinnedArticlesIndex = pinnedArticles.findIndex(
        (item) => item._id === editingArticle._id
      );

      if (allArticlesIndex !== -1) {
        const updatedAllArticles = [...allArticles];
        updatedAllArticles[allArticlesIndex] = updatedArticle;
        setAllArticles(updatedAllArticles);
      } else if (pinnedArticlesIndex !== -1) {
        const updatedPinnedArticles = [...pinnedArticles];
        updatedPinnedArticles[pinnedArticlesIndex] = updatedArticle;
        setPinnedArticles(updatedPinnedArticles);
      }

      window.location.reload(true);
      handleEditClose();
    } catch (error) {
      if (error?.response && error?.response?.data) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error('Server error please try again');
        console.log(error.message);
      }
    }
  };

  const pinArticle = (id) => {
    const articleToPin = allArticles.find((item) => item?._id === id);
    if (articleToPin) {
      setPinnedArticles([...pinnedArticles, articleToPin]); // Add to pinned articles
      setAllArticles(allArticles.filter((item) => item._id !== id)); // Remove from all articles
    }
  };

  const unpinArticle = (id) => {
    const articleToUnpin = pinnedArticles.find((item) => item._id === id);
    if (articleToUnpin) {
      setAllArticles([...allArticles, articleToUnpin]); // Add back to all articles
      setPinnedArticles(pinnedArticles.filter((item) => item._id !== id)); // Remove from pinned articles
    }
  };
  const handleChangeType = (e) => {
    setType(e.target.value);
  };
  const deleteArticle = async (id) => {
    try {
      let response = await axios.delete(`${BASE_URL}/delete-news/${id}`);
      const updatedAllArticles = allArticles.filter((item) => item?._id !== id);
      const updatedPinnedArticles = pinnedArticles.filter(
        (item) => item?._id !== id
      );
      setAllArticles(updatedAllArticles);
      setPinnedArticles(updatedPinnedArticles);
      toast.success('Newsfeed deleted Successfully');
    } catch (error) {
      if (error?.response && error?.response?.data) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error('Server error please try again');
      }
    }

    // const featuredPlayerNames = allArticles?.featuredPlayers.map(playerId => {
    //     const player = players.find(u => u?._id === playerId);
    //     return player ? player.name : '';
    // }).filter(name => name); // Filter out any empty names
  };

  return (
    <div className="flex flex-col gap-[20px] px-[20px]">
      <ToastContainer />
      <div className="flex w-full justify-end items-center">
        <span
          className="py-[10px] px-[20px] rounded-[10px] text-white bg-[#F33] hover:cursor-pointer"
          onClick={handleOpen}
        >
          + New article
        </span>
      </div>
      <h2>Pinned Articles</h2>
      <div className="videos flex flex-wrap gap-[20px]">
        {pinnedArticles?.map((articleItem) => (
          <div
            key={articleItem?._id}
            className="video-card relative w-full  overflow-hidden"
          >
            <div className="relative w-full">
              <img
                id={`image-${articleItem?._id}`}
                src={articleItem?.banner}
                alt="article"
              />
            </div>
            <div className="p-[10px]">
              <p className="text-[16px]">{articleItem?.date}</p>
              <h3 className="text-[18px] font-[500]">{articleItem?.title}</h3>
              <p className="text-[16px] text-[#818181]">
                {articleItem?.description}
              </p>
              <p className="text-[16px] text-[#818181]">
                @ {articleItem?.description}
              </p>
            </div>
            <div
              onClick={() => toggleMenu(articleItem.id)}
              className="absolute top-[10px] right-[10px] hover:cursor-pointer bg-white rounded-[100%] w-[30px] h-[30px] flex items-center justify-center"
            >
              <FaEllipsisV />
              {activeImageId === articleItem.id && (
                <div className="video-menu">
                  <p
                    onClick={() => unpinArticle(articleItem?._id)}
                    className="options"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                        stroke="#0E0E0E"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Unpin
                  </p>
                  <p
                    className="options"
                    onClick={() => openEditModal(articleItem?._id)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.748 20.4438H21.0006"
                        stroke="#0E0E0E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.78 3.79479C13.5557 2.86779 14.95 2.73186 15.8962 3.49173C15.9485 3.53296 17.6295 4.83879 17.6295 4.83879C18.669 5.46719 18.992 6.80311 18.3494 7.82259C18.3153 7.87718 8.81195 19.7645 8.81195 19.7645C8.49578 20.1589 8.01583 20.3918 7.50291 20.3973L3.86353 20.443L3.04353 16.9723C2.92866 16.4843 3.04353 15.9718 3.3597 15.5773L12.78 3.79479Z"
                        stroke="#0E0E0E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.0215 6L16.4737 10.1871"
                        stroke="#0E0E0E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Edit
                  </p>
                  <p
                    className="options"
                    onClick={() => deleteArticle(articleItem?._id)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.3238 9.4668C19.3238 9.4668 18.7808 16.2018 18.4658 19.0388C18.3158 20.3938 17.4788 21.1878 16.1078 21.2128C13.4988 21.2598 10.8868 21.2628 8.27881 21.2078C6.95981 21.1808 6.13681 20.3768 5.98981 19.0458C5.67281 16.1838 5.13281 9.4668 5.13281 9.4668"
                        stroke="#0E0E0E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20.708 6.23828H3.75"
                        stroke="#0E0E0E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17.4406 6.239C16.6556 6.239 15.9796 5.684 15.8256 4.915L15.5826 3.699C15.4326 3.138 14.9246 2.75 14.3456 2.75H10.1126C9.53358 2.75 9.02558 3.138 8.87558 3.699L8.63258 4.915C8.47858 5.684 7.80258 6.239 7.01758 6.239"
                        stroke="#0E0E0E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Delete
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <h2>All Articles</h2>
      <div className="videos flex flex-wrap gap-[20px]">
        {allArticles?.map((articleItem) => (
          <div
            key={articleItem?._id}
            className="video-card relative w-full  overflow-hidden"
          >
            <div className="relative w-full">
              <img
                id={`image-${articleItem?._id}`}
                src={articleItem?.banner}
                alt="article"
              />
            </div>
            <div className="p-[10px]">
              <p className="text-[16px]">{articleItem?.date}</p>
              <h3 className="text-[18px] font-[500]">{articleItem?.title}</h3>
              <p className="text-[16px] text-[#818181]">
                {articleItem?.description}
              </p>
              <p className="text-[16px] text-[#818181]">
                @{' '}
                {articleItem?.featuredPlayers
                  .map((playerId) => {
                    const player = players.find((u) => u?._id === playerId);
                    return player ? player.name : '';
                  })
                  .filter((name) => name)
                  .join(', ')}
              </p>
            </div>
            <div
              onClick={() => toggleMenu(articleItem?._id)}
              className="absolute top-[10px] right-[10px] hover:cursor-pointer bg-white rounded-[100%] w-[30px] h-[30px] flex items-center justify-center"
            >
              <FaEllipsisV />
              {activeImageId === articleItem?._id && (
                <div className="video-menu">
                  <p
                    onClick={() => pinArticle(articleItem?._id)}
                    className="options"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                        stroke="#0E0E0E"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Pin
                  </p>
                  <p
                    className="options"
                    onClick={() => openEditModal(articleItem?._id)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.748 20.4438H21.0006"
                        stroke="#0E0E0E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.78 3.79479C13.5557 2.86779 14.95 2.73186 15.8962 3.49173C15.9485 3.53296 17.6295 4.83879 17.6295 4.83879C18.669 5.46719 18.992 6.80311 18.3494 7.82259C18.3153 7.87718 8.81195 19.7645 8.81195 19.7645C8.49578 20.1589 8.01583 20.3918 7.50291 20.3973L3.86353 20.443L3.04353 16.9723C2.92866 16.4843 3.04353 15.9718 3.3597 15.5773L12.78 3.79479Z"
                        stroke="#0E0E0E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.0215 6L16.4737 10.1871"
                        stroke="#0E0E0E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Edit
                  </p>
                  <p
                    className="options"
                    onClick={() => deleteArticle(articleItem?._id)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.3238 9.4668C19.3238 9.4668 18.7808 16.2018 18.4658 19.0388C18.3158 20.3938 17.4788 21.1878 16.1078 21.2128C13.4988 21.2598 10.8868 21.2628 8.27881 21.2078C6.95981 21.1808 6.13681 20.3768 5.98981 19.0458C5.67281 16.1838 5.13281 9.4668 5.13281 9.4668"
                        stroke="#0E0E0E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20.708 6.23828H3.75"
                        stroke="#0E0E0E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17.4406 6.239C16.6556 6.239 15.9796 5.684 15.8256 4.915L15.5826 3.699C15.4326 3.138 14.9246 2.75 14.3456 2.75H10.1126C9.53358 2.75 9.02558 3.138 8.87558 3.699L8.63258 4.915C8.47858 5.684 7.80258 6.239 7.01758 6.239"
                        stroke="#0E0E0E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Delete
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <p className="justify-center text-[#f33] text-center py-[20px] m-0 text-[26px] font-bold font-sfPro">
          {editingArticle ? 'Edit Article' : 'New Article'}
        </p>
        <p className="justify-center text-center text-[16px] font-sfPro">
          {editingArticle
            ? 'Edit the article details'
            : 'Add new article to it.'}
        </p>
        <Modal.Body>
          <div
            {...getRootProps({ className: 'dropzone' })}
            className="border border-dashed border-gray-400 p-4 rounded-[10px] text-center mb-4"
          >
            <input {...getInputProps()} />
            <p className="media-guide hover:cursor-pointer">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.38948 8.98452H6.45648C4.42148 8.98452 2.77148 10.6345 2.77148 12.6695V17.5445C2.77148 19.5785 4.42148 21.2285 6.45648 21.2285H17.5865C19.6215 21.2285 21.2715 19.5785 21.2715 17.5445V12.6595C21.2715 10.6305 19.6265 8.98452 17.5975 8.98452L16.6545 8.98452"
                  stroke="#130F26"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.0215 2.19142V14.2324"
                  stroke="#130F26"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.10645 5.11914L12.0214 2.19114L14.9374 5.11914"
                  stroke="#130F26"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Upload Picture
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
          <Form>
            <Form.Group className="mb-3" controlId="formVideoTitle">
              <Form.Label className="text-[16px] font-sfPro">Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Write article title"
                value={editingArticle ? editingArticle.title : title} // Pre-fill title if editing
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formParagraph">
              <Form.Label className="text-[16px] font-sfPro">
                Paragraph
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write paragraph"
                value={editingArticle ? editingArticle.paragraph : paragraph} // Pre-fill paragraph if editing
                onChange={(e) => setParagraph(e.target.value)}
              />
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="formDate">
                            <Form.Label className="text-[16px] font-sfPro">Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={editingArticle ? editingArticle.date : date} // Pre-fill date if editing
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </Form.Group> */}
            <Form.Group className="mb-3" controlId="formMention">
              <Form.Label className="text-[16px] font-sfPro">
                Mention Player
              </Form.Label>
              <Select
                isMulti
                value={selectedPlayers}
                onChange={handleChange}
                options={playerOptions}
                placeholder="Mention player"
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="type">
              <Form.Label className="text-[16px] font-sfPro">Type</Form.Label>
              <Form.Select
                aria-label="Default select example"
                value={type}
                onChange={handleChangeType}
              >
                <option value="Top news">Top news</option>
                <option value="Highlights">Highlights</option>
                <option value="Interviews">Interviews</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <span
            className="bg-[#F33] cursor-pointer text-white rounded-[10px] w-full py-[17px] px-[8px] flex items-center justify-center"
            onClick={handleUpload}
          >
            {editingArticle ? 'Update' : 'Upload'}{' '}
            {/* Change button text based on editing state */}
          </span>
        </Modal.Footer>
      </Modal>
      {/* edit modal */}
      <Modal show={EditModal} onHide={handleEditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Article</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            {...getRootProps({ className: 'dropzone' })}
            className="border border-dashed border-gray-400 p-4 rounded-[10px] text-center mb-4"
          >
            <input {...getInputProps()} />
            <p className="media-guide hover:cursor-pointer">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.38948 8.98452H6.45648C4.42148 8.98452 2.77148 10.6345 2.77148 12.6695V17.5445C2.77148 19.5785 4.42148 21.2285 6.45648 21.2285H17.5865C19.6215 21.2285 21.2715 19.5785 21.2715 17.5445V12.6595C21.2715 10.6305 19.6265 8.98452 17.5975 8.98452L16.6545 8.98452"
                  stroke="#130F26"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.0215 2.19142V14.2324"
                  stroke="#130F26"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.10645 5.11914L12.0214 2.19114L14.9374 5.11914"
                  stroke="#130F26"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Upload Picture
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
          <Form>
            <Form.Group controlId="editFormBasicTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Write article title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="editFormBasicParagraph">
              <Form.Label>Paragraph</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write paragraph"
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
              />
            </Form.Group>

            {/* <Form.Group controlId="editFormBasicDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </Form.Group> */}

            <Form.Group className="mb-3" controlId="formMention">
              <Form.Label className="text-[16px] font-sfPro">
                Mention Player
              </Form.Label>
              <Select
                isMulti
                value={selectedPlayers}
                onChange={handleChange}
                options={playerOptions}
                placeholder="Mention player"
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="type">
              <Form.Label className="text-[16px] font-sfPro">Type</Form.Label>
              <Form.Select
                aria-label="Default select example"
                value={type}
                onChange={handleChangeType}
              >
                <option value="Top news">Top news</option>
                <option value="Highlights">Highlights</option>
                <option value="Interviews">Interviews</option>
              </Form.Select>
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
  );
}
