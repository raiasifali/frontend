import './assets/stylesheets/usermanagment.css';
import React, { useEffect, useState } from 'react';
import { Table, Pagination, Button, Modal, Form } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import './assets/stylesheets/manage-videos.css';
import { Rating, RatingStar } from 'flowbite-react';

import { FaCheck, FaTimes, FaEllipsisV, FaEllipsisH } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { BASE_URL } from './baseUrl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserManagement() {
  const [offerFields, setOfferFields] = useState([
    { university: '', date: '', status: '', logo: null },
  ]);

  const handleInputChange = (index, fieldName, value) => {
    const updatedFields = offerFields.map((field, idx) => {
      if (idx === index) {
        return { ...field, [fieldName]: value };
      }
      return field;
    });
    setOfferFields(updatedFields);
  };

  const { getRootProps: getRootPropstwo, getInputProps: getInputPropstwo } =
    useDropzone({
      accept: 'image/*',
      multiple: false,
      onDrop: (acceptedFiles) => {
        console.log('FIELD');
        console.log(acceptedFiles);
        const updatedFields = offerFields.map((field, idx) => {
          if (idx === offerFields.length - 1) {
            // Assuming you are adding a new offer field at the end
            return { ...field, logo: acceptedFiles[0], logoid: idx };
          }
          return field;
        });
        setOfferFields(updatedFields);
      },
    });

  const handleFileInputChange = (e, index) => {
    const file = e.target.files[0];
    const updatedFields = offerFields.map((field, idx) => {
      if (idx === index) {
        return { ...field, logo: file, logoid: idx };
      }
      return field;
    });
    console.log('UPDATEDFIELDS');
    console.log(updatedFields);
    setOfferFields(updatedFields);
  };

  const addOfferField = () => {
    setOfferFields([
      ...offerFields,
      { schoolName: '', offerDate: '', offerStatus: '', logo: null },
    ]);
  };
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [rating, setRating] = useState(0);
  const labels = ['Bad', 'Poor', 'Average', 'Good', 'Excellent'];
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [newPlayerData, setNewPlayerData] = useState({
    name: '',
    playerName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    schoolName: '',
    jerseyNumber: '',
    height: '',
    weight: '',
    coach: {
      phone: '',
      previousCoachName: '',
    },
    playerClass: '',
    birthPlace: '',
    twitterLink: '',
    instagramLink: '',
    facebookLink: '',
    academics: {
      gpa: '',
      satScore: '',
      actScore: '',
      ncaaId: '',
    },

    athleticAccomplishments: '',
    about: '',
    status: 'pending',
    birthplaceCity: '',
    birthplaceState: '',
    gp: '',
    fg: '',
    threep: '',
    ft: '',
    reb: '',
    ast: '',
    blk: '',
    stl: '',
    pf: '',
    to: '',
    pts: '',
    offers: [],
    video1: '',
    video2: '',
    article: '',
  });
  const [editData, setEdiData] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [players, setPlayers] = useState([]);

  const handleRatingChange = (value) => {
    setRating(value);
  };
  const [files, setFiles] = useState([]);
  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };
  const [editID, setEditID] = useState(null);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const handleCloseModal = () => {
    setShowModal(false);
    setNewPlayerData({
      name: '',
      playerName: '',
      lastName: '',
      email: '',
      birthplaceCity: '',
      birthplaceState: '',
      phoneNumber: '',
      schoolName: '',
      jerseyNumber: '',
      height: '',
      offers: [],
      weight: '',
      coach: {
        phone: '',
        previousCoachName: '',
      },
      playerClass: '',
      birthPlace: '',
      twitterLink: '',
      instagramLink: '',
      facebookLink: '',
      academics: {
        gpa: '',
        satScore: '',
        actScore: '',
        ncaaId: '',
      },

      athleticAccomplishments: '',
      about: '',
      status: 'pending',
    });
  };
  const toggleMenu = (videoId) => {
    if (activeVideoId === videoId) {
      setActiveVideoId(null);
    } else {
      setActiveVideoId(videoId);
    }
  };
  const handleAddNewPlayer = async () => {
    const newPlayer = {
      id: data.length + 1,
      playerName: newPlayerData.playerName,
      lastName: newPlayerData.lastName,
      email: newPlayerData.email,
      mobile: newPlayerData.phoneNumber,
      position: newPlayerData.playerClass,
      location: `${newPlayerData.birthplaceCity}, ${newPlayerData.birthplaceState}`,
      registrationDate: new Date().toISOString().slice(0, 10), // Current date as registration date
      status: newPlayerData.status,
      image:
        files.length > 0
          ? URL.createObjectURL(files[0])
          : 'https://static.vecteezy.com/system/resources/thumbnails/008/846/297/small_2x/cute-boy-avatar-png.png', // Use uploaded image or default avatar
      PPG: newPlayerData.PPG,
      RPG: newPlayerData.RPG,
      APG: newPlayerData.APG,
      FG: newPlayerData.FG,
      schoolName: newPlayerData.schoolName,
      jerseyNumber: newPlayerData.jerseyNumber,
      height: newPlayerData.height,
      weight: newPlayerData.weight,
      twitterLink: newPlayerData.twitterLink,
      instagramLink: newPlayerData.instagramLink,
      facebookLink: newPlayerData.facebookLink,
      GPA: newPlayerData.GPA,
      SATScore: newPlayerData.SATScore,
      ACTScore: newPlayerData.ACTScore,
      NCAAID: newPlayerData.NCAAID,
      athleticAccomplishments: newPlayerData.athleticAccomplishments,
      aboutMe: newPlayerData.aboutMe,
      previousCoachName: newPlayerData.previousCoachName,
      coachPhone: newPlayerData.coachPhone,
      video1: newPlayerData.video1,
      video2: newPlayerData.video2,
      article: newPlayerData.article,
    };

    try {
      let name = newPlayer.playerName + ' ' + newPlayer.lastName;
      let athleticAccomplishments = [newPlayer.athleticAccomplishments];
      let socialLinks = [
        {
          social_type: 'twitter',
          link: newPlayer.twitterLink,
        },
        {
          social_type: 'facebook',
          link: newPlayer.facebookLink,
        },
        {
          social_type: 'instagram',
          link: newPlayer.instagramLink,
        },
      ];
      let coach = {
        phone: newPlayer.coachPhone,
      };
      let academics = {
        gpa: newPlayer.GPA,
        satScore: newPlayer.SATScore,
        actScore: newPlayer.ACTScore,
        ncaaId: newPlayer.NCAAID,
      };
      let stats = {
        gp: newPlayerData.gp,
        fg: newPlayerData.fg,
        threep: newPlayerData.threep,
        ft: newPlayerData.ft,
        reb: newPlayerData.reb,
        ast: newPlayerData.ast,
        blk: newPlayerData.blk,
        stl: newPlayerData.stl,
        pf: newPlayerData.pf,
        to: newPlayerData.to,
        pts: newPlayerData.pts,
      };
      console.log('Offer fields');
      console.log(offerFields);

      let formdata = new FormData();
      formdata.append('email', newPlayer.email);
      formdata.append('name', name);
      formdata.append('universityName', newPlayer.schoolName);
      formdata.append('jerseyNumber', newPlayer.jerseyNumber);
      formdata.append('height', newPlayer.height);
      formdata.append('weight', newPlayer.weight);
      formdata.append('birthPlace', newPlayer.location);
      formdata.append('socialLinks', JSON.stringify(socialLinks));
      formdata.append('academics', JSON.stringify(academics));
      formdata.append('athleticaccomplishments', athleticAccomplishments);
      formdata.append('about', newPlayer.aboutMe);
      formdata.append('coach', JSON.stringify(coach));
      formdata.append('picture', files[0]);
      formdata.append('playerClass', newPlayer.position);
      formdata.append('offers', JSON.stringify(offerFields));
      formdata.append('position', 'PG');
      formdata.append('location', newPlayer.location);
      formdata.append('phoneNumber', newPlayer.mobile);
      formdata.append('video1', newPlayer.video1);
      formdata.append('video2', newPlayer.video2);
      formdata.append('article', newPlayer.article);
      formdata.append('stats', JSON.stringify(stats));
      if (rating !== null) {
        formdata.append('starRating', rating);
      }
      formdata.append('previousCoachName', newPlayer.previousCoachName);
      offerFields?.map((val, i) => {
        formdata.append('logo', val.logo);
      });

      let response = await axios.post(`${BASE_URL}/create-player`, formdata);
      setPlayers([...players, newPlayer]);
      handleCloseModal();
      toast.success('Player created');
      window.location.reload(true);
    } catch (error) {
      if (error?.response && error?.response?.data) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error('Server error please try again');
      }
    }
  };
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleEllipsisClick = (row) => {
    setModalContent(row);
  };

  useEffect(() => {
    getAllPlayers();
  }, []);

  const getAllPlayers = async () => {
    let response = await axios.get(`${BASE_URL}/getPlayersAdmin`);
    let { players } = response.data;
    setData(players);
    setPlayers(players);
    console.log(response.data);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);

    setCurrentPage(1);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const filteredPlayers = players.filter((row) => {
    const statusMatch =
      selectedStatus === 'All' || row.status === selectedStatus;

    const nameMatch =
      row?.auth?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    const emailMatch =
      row?.auth?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    const phoneMatch = row?.auth?.phoneNumber?.includes(searchQuery) || false;
    const positionMatch =
      row?.position?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const locationMatch =
      row?.location?.toLowerCase().includes(searchQuery.toLowerCase()) || false;

    return (
      statusMatch &&
      (nameMatch || emailMatch || phoneMatch || positionMatch || locationMatch)
    );
  });

  console.log('Filtered Players:', filteredPlayers); // Debug: Log the final filtered players

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPlayers = filteredPlayers.slice(startIndex, endIndex);
  useEffect(() => {
    console.log('players are', players);
  }, [players]);
  const openEditModal = (row) => {
    setEditID(row._id);
    setEditModal(true);
    const playerToEdit = players.find((player) => player._id === row._id);
    setOfferFields([]);
    playerToEdit?.profile?.offers?.forEach((val) => {
      setOfferFields((prevFields) => [
        ...prevFields,
        {
          schoolName: val?.university,
          offerDate: new Date(val?.date).toISOString().split('T')[0],
          offerStatus: val?.status,
          logo: val?.logo,
        },
      ]);
    });

    setNewPlayerData({
      ...playerToEdit,
    });
  };
  useEffect(() => {
    console.log('data player', newPlayerData);
  }, [newPlayerData]);
  const handleStatusChange = async (id, newStatus) => {
    const updatedPlayers = players?.map((player) => {
      if (player?._id === id) {
        return { ...player, status: newStatus };
      }
      return player;
    });
    try {
      let response = await axios.post(`${BASE_URL}/updateStatus`, {
        id,
        status: newStatus,
      });
      setPlayers(updatedPlayers);
      toast.success('successfully activated');
    } catch (error) {
      if (error?.response && error?.response?.data) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error('Server error please try again');
      }
    }
  };
  const handleRemovePlayer = async (id) => {
    const updatedPlayers = players.filter((player) => player._id !== id);
    try {
      let response = await axios.get(`${BASE_URL}/removePlayer/${id}`);
      toast.success('Success');
      setPlayers(updatedPlayers);
    } catch (error) {
      console.log('ERRRO');
      console.log(error);
      if (error?.response && error?.response?.data) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error('Server error please try again');
      }
    }
  };
  const handleEditPlayer = async () => {
    console.log('updated data', newPlayerData);
    console.log('id is', editID);
    let formdata = new FormData();
    formdata.append('email', newPlayerData.auth.email);
    formdata.append('name', newPlayerData?.auth?.name);
    formdata.append('id', newPlayerData?.auth?._id);
    formdata.append('picture', files[0]);
    formdata.append('universityName', newPlayerData.institute.universityName);
    formdata.append('jerseyNumber', newPlayerData.jerseyNumber);
    formdata.append('height', newPlayerData.height);
    formdata.append('weight', newPlayerData.weight);
    formdata.append(
      'birthPlace',
      newPlayerData.location + ' ' + newPlayerData.birthplaceState
    );
    formdata.append(
      'socialLinks',
      JSON.stringify(newPlayerData?.profile?.socialLinks)
    );
    formdata.append(
      'academics',
      JSON.stringify(newPlayerData?.profile.academics)
    );
    formdata.append(
      'athleticaccomplishments',
      JSON.stringify(newPlayerData?.profile?.athleticaccomplishments)
    );
    formdata.append('about', newPlayerData.profile.about);
    formdata.append('coach', JSON.stringify(newPlayerData?.profile?.coach));
    formdata.append('playerClass', newPlayerData.class);
    formdata.append('position', newPlayerData?.position);
    formdata.append('location', newPlayerData.location);
    formdata.append('phoneNumber', newPlayerData.auth.phoneNumber);
    formdata.append('stats', JSON.stringify(newPlayerData?.profile?.stats));
    formdata.append('previousCoachName', newPlayerData.previousCoachName);
    formdata.append('starRating', rating);

    const transformedOffers = offerFields.map((offer) => ({
      university: offer.schoolName,
      date: offer.offerDate,
      status: offer.offerStatus,
      logo: offer.logo,
      logoid: offer.logoid,
    }));
    formdata.append('offers', JSON.stringify(transformedOffers));
    offerFields?.map((val, i) => {
      formdata.append('logo', val.logo);
    });
    console.log('EDIT OFFERS');
    console.log(offerFields);

    try {
      let response = await axios.post(`${BASE_URL}/create-player`, formdata);
      toast.success('Edited sucessfully');
      window.location.reload(true);
    } catch (error) {
      if (error?.response && error?.response?.data) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error('Server error please try again');
      }
    }
  };
  return (
    <div className='w-full  p-[20px]'>
      <ToastContainer />
      <div className='w-full flex items-center justify-end mb-[40px]'>
        <span
          className='py-[10px] px-[20px] rounded-[10px] text-white bg-[#F33] hover:cursor-pointer'
          onClick={() => setShowModal(true)}>
          + Add New
        </span>
      </div>
      <div className='flex lg:flex-row flex-col justify-between py-[21px] px-[24px] bg-[#E9E9E9] rounded-t-[12px] border-t-[1px] border-b-0 '>
        <div className='lg:flex lg:flex-row grid grid-cols-2 lg:mb-0 mb-[10px] items-center gap-[12px]'>
          <p className='text-[18px] font-[500] m-0'>Players list</p>
          <span
            className={`py-[9px] px-[22px] rounded-[10px] ${
              selectedStatus === 'All' ? 'bg-[#F33] text-white' : 'bg-white'
            } hover:cursor-pointer flex justify-center items-center`}
            onClick={() => handleStatusFilter('All')}>
            All
          </span>
          <span
            className={`py-[9px] px-[22px] rounded-[10px] ${
              selectedStatus === 'pending' ? 'bg-[#F33] text-white' : 'bg-white'
            } hover:cursor-pointer flex justify-center items-center`}
            onClick={() => handleStatusFilter('pending')}>
            Pending
          </span>
          <span
            className={`py-[9px] px-[22px] rounded-[10px] ${
              selectedStatus === 'active' ? 'bg-[#F33] text-white' : 'bg-white'
            } hover:cursor-pointer flex justify-center items-center`}
            onClick={() => handleStatusFilter('active')}>
            Active
          </span>
        </div>
        <div className='flex lg:flex-row flex-col items-center gap-[20px]'>
          <Form.Control
            type='text'
            placeholder='Search...'
            value={searchQuery}
            onChange={handleSearch}
            className='w-[200px]'
          />
          <Form.Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className='w-[100px]'>
            <option value={5}>Show 5</option>
            <option value={10}>Show 10</option>
            <option value={20}>Show 20</option>
            <option value={30}>Show 30</option>
          </Form.Select>
        </div>
      </div>
      <div className='overflow-x-auto w-f'>
        <Table
          striped
          bordered
          hover>
          <thead>
            <tr>
              <th className='text-left text-[16px] font-normal font-sfPro'>
                S-No
              </th>
              <th className='text-left text-[16px] font-normal font-sfPro'>
                Player Name
              </th>
              <th className='text-left text-[16px] font-normal font-sfPro'>
                Email
              </th>
              <th className='text-left text-[16px] font-normal font-sfPro'>
                Mobile Number
              </th>
              <th className='text-left text-[16px] font-normal font-sfPro'>
                Position
              </th>
              <th className='text-left text-[16px] font-normal font-sfPro'>
                Location
              </th>
              <th className='text-left text-[16px] font-normal font-sfPro'>
                Registration Date
              </th>
              <th className='text-left text-[16px] font-normal font-sfPro'>
                Status
              </th>
              <th className='text-left text-[16px] font-normal font-sfPro'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPlayers?.map((row, index) => (
              <tr key={row._id}>
                <td className='py-[21px] px-[20px] border-[1px] border-[#E5E5E5]'>
                  {row._id}
                </td>
                <td className='py-[21px] px-[20px] border-[1px] border-[#E5E5E5]'>
                  <div className='flex items-center'>
                    <img
                      src={row?.picture}
                      alt={row?._id}
                      className='w-[30px] h-[30px] rounded-full mr-[10px]'
                    />
                    <span>{row?.auth?.name}</span>
                  </div>
                </td>
                <td className='py-[21px] px-[20px] border-[1px] border-[#E5E5E5]'>
                  {row?.auth?.email}
                </td>
                <td className='py-[21px] px-[20px] border-[1px] border-[#E5E5E5]'>
                  {row?.auth?.phoneNumber}
                </td>
                <td className='py-[21px] px-[20px] border-[1px] border-[#E5E5E5]'>
                  {row?.position?.toUpperCase()}
                </td>
                <td className='py-[21px] px-[20px] border-[1px] border-[#E5E5E5]'>
                  {row?.location}
                </td>
                <td className='py-[21px] px-[20px] border-[1px] border-[#E5E5E5]'>
                  {row?.auth?.createdAt}
                </td>
                <td className='py-[21px] px-[20px] border-[1px] border-[#E5E5E5]'>
                  {row?.status}
                </td>
                <td className='text-[14px] font-sfPro text-center'>
                  {row?.status === 'pending' ? (
                    <span className='flex items-center justify-between w-full'>
                      <span
                        className='hover:cursor-pointer rounded-[100%] w-[30px] flex m-0 items-center bg-[#F33] h-[30px] justify-center'
                        onClick={() => handleStatusChange(row._id, 'active')}>
                        <svg
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'>
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M16.334 2.75H7.665C4.644 2.75 2.75 4.889 2.75 7.916V16.084C2.75 19.111 4.635 21.25 7.665 21.25H16.333C19.364 21.25 21.25 19.111 21.25 16.084V7.916C21.25 4.889 19.364 2.75 16.334 2.75Z'
                            stroke='white'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M8.43945 12L10.8135 14.373L15.5595 9.62695'
                            stroke='white'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </span>
                      <span
                        className='hover:cursor-pointer bg-white rounded-[100%] w-[30px] flex m-0 items-center h-[30px] justify-center'
                        onClick={() => handleRemovePlayer(row._id)}>
                        <svg
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'>
                          <path
                            d='M14.3955 9.59375L9.60352 14.3857'
                            stroke='#130F26'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M14.3976 14.3888L9.60156 9.5918'
                            stroke='#130F26'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M16.335 2.75H7.66598C4.64498 2.75 2.75098 4.889 2.75098 7.916V16.084C2.75098 19.111 4.63598 21.25 7.66598 21.25H16.334C19.365 21.25 21.251 19.111 21.251 16.084V7.916C21.251 4.889 19.365 2.75 16.335 2.75Z'
                            stroke='#130F26'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </span>
                    </span>
                  ) : row?.status === 'active' ? (
                    <span
                      className='flex w-full justify-center items-center mt-[6px] hover:cursor-pointer relative'
                      onClick={() => toggleMenu(row._id)}>
                      <FaEllipsisH />
                      {activeVideoId === row?._id && (
                        <div className='video-menu z-[9999]'>
                          <p
                            className='options'
                            onClick={() => {
                              openEditModal(row);
                            }}>
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
                            onClick={() => handleRemovePlayer(row._id)}>
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
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination className='justify-content-end'>
          <Pagination.Prev
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          />
          <Pagination.Item>{currentPage}</Pagination.Item>
          <Pagination.Next
            onClick={handleNextPage}
            disabled={endIndex >= filteredPlayers.length}
          />
        </Pagination>
      </div>
      <Modal
        show={showModal}
        onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Player</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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

            {/* Stats */}
            <Form.Group
              controlId='formStats'
              className='flex flex-col gap-[20px]'>
              <Form.Label>Stats</Form.Label>
              <Form.Control
                type='number'
                placeholder='GP'
                value={newPlayerData.gp}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, gp: e.target.value })
                }
              />
              <Form.Control
                type='number'
                placeholder='FG'
                value={newPlayerData.fg}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, fg: e.target.value })
                }
              />
              <Form.Control
                type='number'
                placeholder='Threep'
                value={newPlayerData.threep}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, threep: e.target.value })
                }
              />
              <Form.Control
                type='number'
                placeholder='Ft'
                value={newPlayerData.ft}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, ft: e.target.value })
                }
              />

              {/* <Form.Control
                placeholder='Rating'
                as='select'
                value={rating}
                onChange={(e) => setRating(e.target.value)}>
                <option value={null}>Select rating</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </Form.Control> */}
              <div>
                <p className='text-[16px] mb-2'>Rating</p>
                <Rating>
                  {[...Array(5)].map((_, index) => (
                    <RatingStar
                      key={index}
                      filled={index < rating}
                      onClick={() => handleRatingChange(index + 1)}
                      style={{ color: index < rating ? 'gold' : 'gray' }}
                    />
                  ))}
                </Rating>
                <div className='rating-label'>
                  {rating > 0 && <span>{labels[rating - 1]}</span>}
                </div>
              </div>

              <Form.Control
                type='number'
                placeholder='Reb'
                value={newPlayerData.reb}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, reb: e.target.value })
                }
              />

              <Form.Control
                type='number'
                placeholder='Ast'
                value={newPlayerData.ast}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, ast: e.target.value })
                }
              />

              <Form.Control
                type='number'
                placeholder='Blk'
                value={newPlayerData.blk}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, blk: e.target.value })
                }
              />

              <Form.Control
                type='number'
                placeholder='Stl'
                value={newPlayerData.stl}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, stl: e.target.value })
                }
              />

              <Form.Control
                type='number'
                placeholder='Pf'
                value={newPlayerData.pf}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, pf: e.target.value })
                }
              />

              <Form.Control
                type='number'
                placeholder='To'
                value={newPlayerData.to}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, to: e.target.value })
                }
              />

              <Form.Control
                type='number'
                placeholder='Pts'
                value={newPlayerData.pts}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, pts: e.target.value })
                }
              />
            </Form.Group>

            {/* Contact Information */}
            <Form.Group
              controlId='formContactInformation'
              className=' mt-[10px] flex flex-col gap-[20px]'>
              <Form.Label>Contact Information</Form.Label>
              <Form.Control
                type='text'
                placeholder='First Name'
                value={newPlayerData.playerName}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    playerName: e.target.value,
                  })
                }
              />
              <Form.Control
                type='text'
                placeholder='Last Name'
                value={newPlayerData.lastName}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    lastName: e.target.value,
                  })
                }
              />
              <Form.Control
                type='email'
                placeholder='Email'
                value={newPlayerData.email}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, email: e.target.value })
                }
              />
              <Form.Control
                type='text'
                placeholder='Phone Number'
                value={newPlayerData.phoneNumber}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    phoneNumber: e.target.value,
                  })
                }
              />
              <Form.Control
                type='text'
                placeholder='School Name'
                value={newPlayerData.universityName}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    schoolName: e.target.value,
                  })
                }
              />
              <Form.Control
                type='text'
                placeholder='Jersey Number'
                value={newPlayerData.jerseyNumber}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    jerseyNumber: e.target.value,
                  })
                }
              />
              <Form.Control
                type='text'
                placeholder='Height'
                value={newPlayerData.height}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, height: e.target.value })
                }
              />
              <Form.Control
                type='text'
                placeholder='Weight'
                value={newPlayerData.weight}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, weight: e.target.value })
                }
              />
              <Form.Control
                type='text'
                placeholder='Class'
                value={newPlayerData.playerClass}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    playerClass: e.target.value,
                  })
                }
              />
              <Form.Group
                controlId='formBirthplace'
                className=' mt-[10px] flex flex-col gap-[20px]'>
                <Form.Label>Birthplace</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='City'
                  value={newPlayerData.birthplaceCity}
                  onChange={(e) =>
                    setNewPlayerData({
                      ...newPlayerData,
                      birthplaceCity: e.target.value,
                    })
                  }
                />
                <Form.Control
                  type='text'
                  placeholder='State'
                  value={newPlayerData.birthplaceState}
                  onChange={(e) =>
                    setNewPlayerData({
                      ...newPlayerData,
                      birthplaceState: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form.Group>

            {/* Contact Details */}
            <Form.Group
              controlId='formContactDetails'
              className=' mt-[10px] flex flex-col gap-[20px]'>
              <Form.Label>Contact Details</Form.Label>
              <Form.Control
                type='text'
                placeholder='Twitter Link'
                value={newPlayerData.twitterLink}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    twitterLink: e.target.value,
                  })
                }
              />
              <Form.Control
                type='text'
                placeholder='Instagram Link'
                value={newPlayerData.instagramLink}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    instagramLink: e.target.value,
                  })
                }
              />
              <Form.Control
                type='text'
                placeholder='Facebook Link'
                value={newPlayerData.facebookLink}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    facebookLink: e.target.value,
                  })
                }
              />
            </Form.Group>
            {/* video link and articles */}
            <Form.Group
              controlId='formVideoLink'
              className='flex flex-col gap-[20px] mt-[20px]'>
              <div>
                <Form.Control
                  type='text'
                  placeholder='Video Link 1'
                  value={newPlayerData.video1}
                  onChange={(e) =>
                    setNewPlayerData({
                      ...newPlayerData,
                      video1: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Form.Control
                  type='text'
                  placeholder='Video Link 2'
                  value={newPlayerData.video2}
                  onChange={(e) =>
                    setNewPlayerData({
                      ...newPlayerData,
                      video2: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Form.Control
                  as='textarea'
                  rows={3}
                  placeholder='Enter article'
                  value={newPlayerData.article}
                  onChange={(e) =>
                    setNewPlayerData({
                      ...newPlayerData,
                      article: e.target.value,
                    })
                  }
                />
              </div>
            </Form.Group>
            {/* video link and articles */}
            {/* Academics */}
            <Form.Group
              controlId='formAcademics'
              className=' mt-[10px] flex flex-col gap-[20px]'>
              <Form.Label>Academics</Form.Label>
              <Form.Control
                type='text'
                placeholder='GPA'
                value={newPlayerData.GPA}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, GPA: e.target.value })
                }
              />
              <Form.Control
                type='text'
                placeholder='SAT Score'
                value={newPlayerData.SATScore}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    SATScore: e.target.value,
                  })
                }
              />
              <Form.Control
                type='text'
                placeholder='ACT Score'
                value={newPlayerData.ACTScore}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    ACTScore: e.target.value,
                  })
                }
              />
              <Form.Control
                type='text'
                placeholder='NCAA ID'
                value={newPlayerData.NCAAID}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, NCAAID: e.target.value })
                }
              />
            </Form.Group>

            {/* Athletic Accomplishments */}
            <Form.Group
              controlId='formAthleticAccomplishments'
              className=' mt-[10px] flex flex-col gap-[20px]'>
              <Form.Label>Athletic Accomplishments</Form.Label>
              {/* Use a textarea or list input for athletic accomplishments */}
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Enter athletic accomplishments'
                value={newPlayerData.athleticAccomplishments}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    athleticAccomplishments: e.target.value,
                  })
                }
              />
            </Form.Group>

            {/* About Me */}
            <Form.Group
              controlId='formAboutMe'
              className=' mt-[10px] flex flex-col gap-[20px]'>
              <Form.Label>About Me</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Enter about me'
                value={newPlayerData.aboutMe}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    aboutMe: e.target.value,
                  })
                }
              />
            </Form.Group>

            {/* Coach Information */}
            <Form.Group
              controlId='formCoachInformation'
              className=' mt-[10px] flex flex-col gap-[20px]'>
              <Form.Label>Coach Information</Form.Label>
              <Form.Control
                type='text'
                placeholder='Previous Coach Name'
                value={newPlayerData.previousCoachName}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    previousCoachName: e.target.value,
                  })
                }
              />
              <Form.Control
                type='text'
                placeholder='Coach Phone'
                value={newPlayerData.coachPhone}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    coachPhone: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group
              controlId='formLogoSchoolOffer'
              className='mt-[10px] flex flex-col gap-[20px]'>
              <Form.Label>Logo</Form.Label>
              {/* Assuming Dropzone component is used for logo upload */}
              {offerFields.map((offer, index) => (
                <Form.Group
                  key={index}
                  controlId={`offerField_${index}`}>
                  <Form.Control
                    type='text'
                    placeholder='University Name'
                    value={offer.university}
                    onChange={(e) =>
                      handleInputChange(index, 'university', e.target.value)
                    }
                  />
                  <Form.Control
                    type='date'
                    placeholder='Offer Date'
                    value={offer.date}
                    onChange={(e) =>
                      handleInputChange(index, 'date', e.target.value)
                    }
                  />
                  <Form.Control
                    as='select'
                    value={offer.status}
                    onChange={(e) =>
                      handleInputChange(index, 'status', e.target.value)
                    }>
                    <option value=''>Select Offer Status</option>
                    <option value='Committed'>Committed</option>
                    <option value='Offered'>Offered</option>
                    <option value='Visited'>Visited</option>
                    <option value='Visiting'>Visiting</option>
                    <option value='Walk-on'>Walk-on</option>
                    <option value='Redshirt'>Redshirt</option>
                    <option value='Interested'>Interested</option>
                    <option value='Pending'>Pending</option>
                    <option value='Signed'>Signed</option>
                    {/* Add more options if needed */}
                  </Form.Control>
                  <div className='border border-dashed border-gray-400 p-4 rounded-[10px] text-center mb-4'>
                    <label className='block'>
                      <input
                        type='file'
                        className='hidden'
                        onChange={(e) => handleFileInputChange(e, index)}
                      />
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
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M12.0215 2.19142V14.2324'
                            stroke='#130F26'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M9.10645 5.11914L12.0214 2.19114L14.9374 5.11914'
                            stroke='#130F26'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        Upload Logo
                      </p>
                    </label>
                    {offer.logo && (
                      <div>
                        <h4>Selected file:</h4>
                        <ul>
                          <li>
                            {offer.logo.name} - {offer.logo.size} bytes
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </Form.Group>
              ))}
              <Button
                variant='primary'
                onClick={addOfferField}>
                + Add More
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant='primary'
            onClick={handleAddNewPlayer}>
            Add Player
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={editModal}
        onHide={() => setEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Player</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
                Upload Picture
              </p>
              {files.length > 0 ? (
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
              ) : (
                <p>{editData?.picture}</p>
              )}
            </div>

            {/* Stats */}
            <Form.Group
              controlId='formStats'
              className='flex flex-col gap-[20px]'>
              <Form.Label>Stats</Form.Label>
              <Form.Control
                type='number'
                placeholder='GP'
                value={newPlayerData?.profile?.stats?.gp || ''}
                onChange={(e) => {
                  const newGPValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const profile = prevData.profile || {}; // Ensure profile is an object
                    const stats = profile.stats || {}; // Ensure stats is an object
                    const updatedStats = { ...stats, gp: newGPValue }; // Update gp field
                    const updatedProfile = { ...profile, stats: updatedStats }; // Update profile
                    return { ...prevData, profile: updatedProfile }; // Return new state
                  });
                }}
              />
              <Form.Control
                type='number'
                placeholder='FG'
                value={newPlayerData?.profile?.stats?.fg || ''}
                onChange={(e) => {
                  const newFGValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const profile = prevData.profile || {}; // Ensure profile is an object
                    const stats = profile.stats || {}; // Ensure stats is an object
                    const updatedStats = { ...stats, fg: newFGValue }; // Update fg field
                    const updatedProfile = { ...profile, stats: updatedStats }; // Update profile
                    return { ...prevData, profile: updatedProfile }; // Return new state
                  });
                }}
              />
              <Form.Control
                type='number'
                placeholder='Threep'
                value={newPlayerData?.profile?.stats?.threep || ''}
                onChange={(e) => {
                  const newThreepValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const profile = prevData.profile || {}; // Ensure profile is an object
                    const stats = profile.stats || {}; // Ensure stats is an object
                    const updatedStats = { ...stats, threep: newThreepValue }; // Update threep field
                    const updatedProfile = { ...profile, stats: updatedStats }; // Update profile
                    return { ...prevData, profile: updatedProfile }; // Return new state
                  });
                }}
              />
              <Form.Control
                type='number'
                placeholder='Ft'
                value={newPlayerData?.profile?.stats?.ft || ''}
                onChange={(e) => {
                  const newFTValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const profile = prevData.profile || {};
                    const stats = profile.stats || {};
                    const updatedStats = { ...stats, ft: newFTValue };
                    const updatedProfile = { ...profile, stats: updatedStats };
                    return { ...prevData, profile: updatedProfile };
                  });
                }}
              />

              <Form.Control
                type='number'
                placeholder='Reb'
                value={newPlayerData?.profile?.stats?.reb || ''}
                onChange={(e) => {
                  const newRebValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const profile = prevData.profile || {};
                    const stats = profile.stats || {};
                    const updatedStats = { ...stats, reb: newRebValue };
                    const updatedProfile = { ...profile, stats: updatedStats };
                    return { ...prevData, profile: updatedProfile };
                  });
                }}
              />

              <Form.Control
                type='number'
                placeholder='Ast'
                value={newPlayerData?.profile?.stats?.ast || ''}
                onChange={(e) => {
                  const newAstValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const profile = prevData.profile || {};
                    const stats = profile.stats || {};
                    const updatedStats = { ...stats, ast: newAstValue };
                    const updatedProfile = { ...profile, stats: updatedStats };
                    return { ...prevData, profile: updatedProfile };
                  });
                }}
              />

              <Form.Control
                type='number'
                placeholder='Blk'
                value={newPlayerData?.profile?.stats?.blk || ''}
                onChange={(e) => {
                  const newBlkValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const profile = prevData.profile || {};
                    const stats = profile.stats || {};
                    const updatedStats = { ...stats, blk: newBlkValue };
                    const updatedProfile = { ...profile, stats: updatedStats };
                    return { ...prevData, profile: updatedProfile };
                  });
                }}
              />

              <Form.Control
                type='number'
                placeholder='Stl'
                value={newPlayerData?.profile?.stats?.stl || ''}
                onChange={(e) => {
                  const newStlValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const profile = prevData.profile || {};
                    const stats = profile.stats || {};
                    const updatedStats = { ...stats, stl: newStlValue };
                    const updatedProfile = { ...profile, stats: updatedStats };
                    return { ...prevData, profile: updatedProfile };
                  });
                }}
              />

              <Form.Control
                type='number'
                placeholder='Pf'
                value={newPlayerData?.profile?.stats?.pf || ''}
                onChange={(e) => {
                  const newPfValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const profile = prevData.profile || {};
                    const stats = profile.stats || {};
                    const updatedStats = { ...stats, pf: newPfValue };
                    const updatedProfile = { ...profile, stats: updatedStats };
                    return { ...prevData, profile: updatedProfile };
                  });
                }}
              />

              <Form.Control
                type='number'
                placeholder='To'
                value={newPlayerData?.profile?.stats?.to || ''}
                onChange={(e) => {
                  const newToValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const profile = prevData.profile || {};
                    const stats = profile.stats || {};
                    const updatedStats = { ...stats, to: newToValue };
                    const updatedProfile = { ...profile, stats: updatedStats };
                    return { ...prevData, profile: updatedProfile };
                  });
                }}
              />

              <Form.Control
                type='number'
                placeholder='Pts'
                value={newPlayerData?.profile?.stats?.pts || ''}
                onChange={(e) => {
                  const newPtsValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const profile = prevData.profile || {};
                    const stats = profile.stats || {};
                    const updatedStats = { ...stats, pts: newPtsValue };
                    const updatedProfile = { ...profile, stats: updatedStats };
                    return { ...prevData, profile: updatedProfile };
                  });
                }}
              />
            </Form.Group>
            <div>
              <p className='text-[16px] mb-2'>Rating</p>
              <Rating>
                {[...Array(5)].map((_, index) => (
                  <RatingStar
                    key={index}
                    filled={index < rating}
                    onClick={() => handleRatingChange(index + 1)}
                    style={{ color: index < rating ? 'gold' : 'gray' }}
                  />
                ))}
              </Rating>
              <div className='rating-label'>
                {rating > 0 && <span>{labels[rating - 1]}</span>}
              </div>
            </div>

            {/* Contact Information */}
            <Form.Group
              controlId='formContactInformation'
              className=' mt-[10px] flex flex-col gap-[20px]'>
              <Form.Label>Contact Information</Form.Label>
              <Form.Control
                type='text'
                placeholder='First Name'
                value={newPlayerData?.auth?.name?.split(' ')[0]}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    playerName: e.target.value,
                  })
                }
              />
              <Form.Control
                type='text'
                placeholder='Last Name'
                value={newPlayerData?.auth?.name?.split(' ')[1]}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    lastName: e.target.value,
                  })
                }
              />
              <Form.Control
                type='email'
                placeholder='Email'
                value={newPlayerData?.auth?.email}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    auth: {
                      ...newPlayerData.auth,
                      email: e.target.value,
                    },
                  })
                }
              />
              <Form.Control
                type='text'
                placeholder='Phone Number'
                value={newPlayerData?.auth?.phoneNumber}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    auth: {
                      ...newPlayerData.auth,
                      phoneNumber: e.target.value,
                    },
                  })
                }
              />
              <Form.Control
                type='text'
                placeholder='School Name'
                value={newPlayerData?.institute?.universityName}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    institute: {
                      ...newPlayerData.institute,
                      universityName: e.target.value,
                    },
                  })
                }
              />
              <Form.Control
                type='text'
                placeholder='Jersey Number'
                value={newPlayerData?.jerseyNumber?.toString()}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    jerseyNumber: e.target.value,
                  })
                }
              />
              <Form.Control
                type='text'
                placeholder='Height'
                value={newPlayerData?.height}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, height: e.target.value })
                }
              />
              <Form.Control
                type='text'
                placeholder='Weight'
                value={newPlayerData?.weight}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, weight: e.target.value })
                }
              />
              <Form.Control
                type='text'
                placeholder='Class'
                value={newPlayerData?.class}
                onChange={(e) =>
                  setNewPlayerData({ ...newPlayerData, class: e.target.value })
                }
              />
              <Form.Group
                controlId='formBirthplace'
                className=' mt-[10px] flex flex-col gap-[20px]'>
                <Form.Label>Birthplace</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='City'
                  value={newPlayerData?.birthPlace?.split(' ')[0]}
                  onChange={(e) =>
                    setNewPlayerData({
                      ...newPlayerData,
                      birthplaceCity: e.target.value,
                    })
                  }
                />
                <Form.Control
                  type='text'
                  placeholder='State'
                  value={newPlayerData?.birthPlace?.split(' ')[1]}
                  onChange={(e) =>
                    setNewPlayerData({
                      ...newPlayerData,
                      birthplaceState: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form.Group>

            {/* Contact Details */}
            <Form.Group
              controlId='formContactDetails'
              className=' mt-[10px] flex flex-col gap-[20px]'>
              <Form.Label>Contact Details</Form.Label>
              <Form.Control
                type='text'
                placeholder='Twitter Link'
                value={
                  newPlayerData?.profile?.socialLinks?.find(
                    (u) => u?.social_type == 'twitter'
                  )?.link
                }
                onChange={(e) => {
                  const newLinkValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const socialLinks = prevData.profile.socialLinks || [];
                    const twitterIndex = socialLinks.findIndex(
                      (link) => link.social_type === 'twitter'
                    );

                    if (twitterIndex !== -1) {
                      // Update existing twitter link
                      const updatedLinks = socialLinks.map((link, index) =>
                        index === twitterIndex
                          ? { ...link, link: newLinkValue }
                          : link
                      );
                      return {
                        ...prevData,
                        profile: {
                          ...prevData.profile,
                          socialLinks: updatedLinks,
                        },
                      };
                    } else {
                      // Add new twitter link
                      return {
                        ...prevData,
                        profile: {
                          ...prevData.profile,
                          socialLinks: [
                            ...socialLinks,
                            { social_type: 'twitter', link: newLinkValue },
                          ],
                        },
                      };
                    }
                  });
                }}
              />
              <Form.Control
                type='text'
                placeholder='Instagram Link'
                value={
                  newPlayerData?.profile?.socialLinks?.find(
                    (u) => u?.social_type == 'instagram'
                  )?.link
                }
                onChange={(e) => {
                  const newLinkValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const socialLinks = prevData.profile.socialLinks || [];
                    const instagramIndex = socialLinks?.findIndex(
                      (link) => link?.social_type === 'instagram'
                    );

                    if (instagramIndex !== -1) {
                      // Update existing instagram link
                      const updatedLinks = socialLinks?.map((link, index) =>
                        index === instagramIndex
                          ? { ...link, link: newLinkValue }
                          : link
                      );
                      return {
                        ...prevData,
                        profile: {
                          ...prevData.profile,
                          socialLinks: updatedLinks,
                        },
                      };
                    } else {
                      // Add new instagram link
                      return {
                        ...prevData,
                        profile: {
                          ...prevData.profile,
                          socialLinks: [
                            ...socialLinks,
                            { social_type: 'instagram', link: newLinkValue },
                          ],
                        },
                      };
                    }
                  });
                }}
              />
              <Form.Control
                type='text'
                placeholder='Facebook Link'
                value={
                  newPlayerData?.profile?.socialLinks?.find(
                    (u) => u?.social_type == 'facebook'
                  )?.link
                }
                onChange={(e) => {
                  const newLinkValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const socialLinks = prevData?.profile?.socialLinks || [];
                    const facebookIndex = socialLinks?.findIndex(
                      (link) => link?.social_type === 'facebook'
                    );

                    if (facebookIndex !== -1) {
                      // Update existing facebook link
                      const updatedLinks = socialLinks?.map((link, index) =>
                        index === facebookIndex
                          ? { ...link, link: newLinkValue }
                          : link
                      );
                      return {
                        ...prevData,
                        profile: {
                          ...prevData.profile,
                          socialLinks: updatedLinks,
                        },
                      };
                    } else {
                      // Add new facebook link
                      return {
                        ...prevData,
                        profile: {
                          ...prevData.profile,
                          socialLinks: [
                            ...socialLinks,
                            { social_type: 'facebook', link: newLinkValue },
                          ],
                        },
                      };
                    }
                  });
                }}
              />
            </Form.Group>
            {/* video link and articles */}
            <Form.Group
              controlId='formVideoLink'
              className='flex flex-col gap-[20px] mt-[20px]'>
              <div>
                <Form.Control
                  type='text'
                  placeholder='Video Link 1'
                  value={newPlayerData.video1}
                  onChange={(e) =>
                    setNewPlayerData({
                      ...newPlayerData,
                      video1: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Form.Control
                  type='text'
                  placeholder='Video Link 2'
                  value={newPlayerData.video2}
                  onChange={(e) =>
                    setNewPlayerData({
                      ...newPlayerData,
                      video2: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Form.Control
                  as='textarea'
                  rows={3}
                  placeholder='Enter article'
                  value={newPlayerData.article}
                  onChange={(e) =>
                    setNewPlayerData({
                      ...newPlayerData,
                      article: e.target.value,
                    })
                  }
                />
              </div>
            </Form.Group>
            {/* video link and articles */}
            {/* Academics */}
            <Form.Group
              controlId='formAcademics'
              className=' mt-[10px] flex flex-col gap-[20px]'>
              <Form.Label>Academics</Form.Label>
              <Form.Control
                type='text'
                placeholder='GPA'
                value={newPlayerData?.profile?.academics[0]?.gpa}
                onChange={(e) => {
                  const newGpaValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const academics = prevData.profile.academics || [{}];
                    const updatedAcademics = academics.map((academic, index) =>
                      index === 0 ? { ...academic, gpa: newGpaValue } : academic
                    );
                    return {
                      ...prevData,
                      profile: {
                        ...prevData.profile,
                        academics: updatedAcademics,
                      },
                    };
                  });
                }}
              />
              <Form.Control
                type='text'
                placeholder='SAT Score'
                value={newPlayerData?.profile?.academics[0]?.satScore}
                onChange={(e) => {
                  const newSATScoreValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const academics = prevData.academics || [{}];
                    const updatedAcademics = academics.map((academic, index) =>
                      index === 0
                        ? { ...academic, satScore: newSATScoreValue }
                        : academic
                    );
                    return { ...prevData, academics: updatedAcademics };
                  });
                }}
              />
              <Form.Control
                type='text'
                placeholder='ACT Score'
                value={newPlayerData?.profile?.academics[0]?.actScore}
                onChange={(e) => {
                  const newSATScoreValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const academics = prevData.academics || [{}];
                    const updatedAcademics = academics.map((academic, index) =>
                      index === 0
                        ? { ...academic, satScore: newSATScoreValue }
                        : academic
                    );
                    return { ...prevData, academics: updatedAcademics };
                  });
                }}
              />
              <Form.Control
                type='text'
                placeholder='NCAA ID'
                value={newPlayerData?.profile?.academics[0]?.ncaaId}
                onChange={(e) => {
                  const newNCAAIDValue = e.target.value;
                  setNewPlayerData((prevData) => {
                    const academics = prevData.profile.academics || [{}];
                    const updatedAcademics = academics.map((academic, index) =>
                      index === 0
                        ? { ...academic, ncaaId: newNCAAIDValue }
                        : academic
                    );
                    return {
                      ...prevData,
                      profile: {
                        ...prevData.profile,
                        academics: updatedAcademics,
                      },
                    };
                  });
                }}
              />
            </Form.Group>

            {/* Athletic Accomplishments */}
            <Form.Group
              controlId='formAthleticAccomplishments'
              className=' mt-[10px] flex flex-col gap-[20px]'>
              <Form.Label>Athletic Accomplishments</Form.Label>
              {/* Use a textarea or list input for athletic accomplishments */}
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Enter athletic accomplishments'
                value={newPlayerData?.profile?.athleticaccomplishments?.join(
                  ','
                )}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    profile: {
                      ...newPlayerData.profile,
                      athleticaccomplishments: [e.target.value],
                    },
                  })
                }
              />
            </Form.Group>

            {/* About Me */}
            <Form.Group
              controlId='formAboutMe'
              className=' mt-[10px] flex flex-col gap-[20px]'>
              <Form.Label>About Me</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Enter about me'
                value={newPlayerData?.profile?.about}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    profile: {
                      ...newPlayerData.profile,
                      about: e.target.value,
                    },
                  })
                }
              />
            </Form.Group>

            {/* Coach Information */}
            <Form.Group
              controlId='formCoachInformation'
              className=' mt-[10px] flex flex-col gap-[20px]'>
              <Form.Label>Coach Information</Form.Label>
              <Form.Control
                type='text'
                placeholder='Previous Coach Name'
                value={newPlayerData.previousCoachName}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    previousCoachName: e.target.value,
                  })
                }
              />
              <Form.Control
                type='text'
                placeholder='Coach Phone'
                value={newPlayerData?.profile?.coach?.phone}
                onChange={(e) =>
                  setNewPlayerData({
                    ...newPlayerData,
                    profile: {
                      ...newPlayerData.profile,
                      coach: {
                        ...newPlayerData.profile.coach,
                        phone: e.target.value,
                      },
                    },
                  })
                }
              />
            </Form.Group>
            {/* offers*/}
            {offerFields.map((offer, index) => (
              <div
                key={index}
                className='border border-dashed border-gray-400 p-4 rounded-[10px] text-center mb-4'>
                <Form.Control
                  type='text'
                  placeholder='School Name'
                  value={offer.schoolName}
                  onChange={(e) =>
                    handleInputChange(index, 'schoolName', e.target.value)
                  }
                />
                <Form.Control
                  type='date'
                  placeholder='Offer Date'
                  value={offer.offerDate}
                  onChange={(e) =>
                    handleInputChange(index, 'offerDate', e.target.value)
                  }
                />
                <Form.Control
                  as='select'
                  value={offer.offerStatus}
                  onChange={(e) =>
                    handleInputChange(index, 'offerStatus', e.target.value)
                  }>
                  <option value=''>Select Offer Status</option>
                  <option value='Committed'>Committed</option>
                  <option value='Offered'>Offered</option>
                  <option value='Visited'>Visited</option>
                  <option value='Visiting'>Visiting</option>
                  <option value='Walk-on'>Walk-on</option>
                  <option value='Redshirt'>Redshirt</option>
                  <option value='Interested'>Interested</option>
                  <option value='Transferred'>Transferred</option>
                  <option value='Pending'>Pending</option>
                  <option value='Signed'>Signed</option>
                  {/* Add more options if needed */}
                </Form.Control>
                <label className='border border-dashed border-gray-400 p-4 rounded-[10px] text-center mb-4 block'>
                  <input
                    type='file'
                    className='hidden'
                    onChange={(e) => handleFileInputChange(e, index)}
                  />
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
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M12.0215 2.19142V14.2324'
                        stroke='#130F26'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M9.10645 5.11914L12.0214 2.19114L14.9374 5.11914'
                        stroke='#130F26'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    Upload Logo
                  </p>
                  {offer.logo && (
                    <div>
                      <h4>Selected file:</h4>
                      <ul>
                        <li>
                          {offer.logo.name} - {offer.logo.size} bytes
                        </li>
                      </ul>
                    </div>
                  )}
                </label>
              </div>
            ))}

            <Button
              variant='primary'
              onClick={addOfferField}>
              + Add More
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='primary'
            onClick={handleEditPlayer}>
            Edit Player
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
