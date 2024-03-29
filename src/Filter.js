import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import adresse from './images/icon/adress.svg';
import filtre from './images/icon/icon_filtre.svg';
import filtreNoir from './images/icon/icon_filtre_n.svg';
import localisation from './images/icon/icon_localisation.svg';
import sablier from './images/icon/icon_sablier.svg';
import sablierB from './images/icon/icon_sablier_b.svg';
import Recherche from './images/icon/icon_recherche.svg';
import pleure from './images/illustrations/pleure.png';
import { motion } from 'framer-motion/dist/framer-motion';
import animationData2 from './images/animation/loading.json';
import animationData3 from './images/animation/loader_light.json';
import animationData4 from './images/animation/loader_dark.json';
import Lottie from 'react-lottie';
import { AES, enc } from 'crypto-js';
import { Link } from 'react-router-dom';

const Filter = ({ searchValue, setSearchValue }) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [modalItem, setModalItem] = useState([]);
  let filterByFilters;
  const [filters, setFilters] = useState({
    filtered: false,
    category: '',
    postal: '',
    filter_by: 'upvote',
  })

  let decrypted;
  if (localStorage.getItem('isConnected')) {
    decrypted = AES.decrypt(localStorage.getItem('id_user'), 'MYKEY4DEMO');
  } else {
    decrypted = AES.decrypt(sessionStorage.getItem('id_user'), 'MYKEY4DEMO');
  }
  const id_user = decrypted.toString(enc.Utf8);

  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);

  /* Permet de vider le state Filter */

  const handleReset = () => {
    setFilters({
      filtered: false,
      category: '',
      postal: '',
      filter_by: '',
    });
    setOpenModal(false);
  }

  /* Permet de stocker dans filter */

  const handleChange = e => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  /* Permet de récupérer les posts pour les stocker dans le state item sous forme d'un tableau d'objets */

  useEffect(() => {
    fetch("https://benef-app.fr/api-post-render.php")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.items);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  const handleSubmitFiltered = e => {
    e.preventDefault();
    setFilters(prevState => ({
      ...prevState,
      filtered: true
    }));
  }

  /* Trier en fonction des votes */

  function compareUpvote(a, b) {
    if (parseInt(a.upvote) < parseInt(b.upvote)) {
      return 1;
    }
    if (parseInt(a.upvote) > parseInt(b.upvote)) {
      return -1;
    }
    return 0;
  }

  /* Trier en fonction de la date de publication (grâce à l'id)*/

  function compareDate(a, b) {
    if (parseInt(a.id_post) < parseInt(b.id_post)) {
      return 1;
    }
    if (parseInt(a.id_post) > parseInt(b.id_post)) {
      return -1;
    }
    return 0;
  }

  const modal = useRef(null);
  const modal2 = useRef(null);

  function handleModal() {
    setOpenModal2(true);
    setModalItem(this);
  }

  /* Fetch pour afficher infos de l'utilisateur qui a posté le bon plan */

  useEffect(() => {
    if (openModal2) {
      fetch('https://benef-app.fr/api-infos-utilisateur.php', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_user: modalItem.id_user })
      })
        .then((response) => response.json())
        .then((data) => {
          const envryptedString = AES.encrypt(data.id_user, 'MYKEY4DEMO');
          localStorage.setItem('id_user_post', envryptedString.toString());
          // history.push('/profil2');
          setModalItem(prevState => ({
            ...prevState,
            user_pseudo: data.username,
            file: data.image
          }));
          
        })
        .catch(err => {
          console.log("Error Reading data " + err);
        });
    }
  }, [openModal2])

  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: animationData3,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const defaultOptions3 = {
    loop: true,
    autoplay: true,
    animationData: animationData4,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  if (error) {

    /* Affichage d'erreur */

    return <div className="mb-5 mt-5 mx-3 flex flex-col items-center text-center">
    <img className="mt-5 mb-5 w-20" src={pleure} alt='emoji pleure' />
    <h1 className="text-lg xl:text-xl font-semibold max-w-md mt-2">
      Mince, il y a un petit problème<br></br>
      <div className="font-light xl:text-base flex flex-wrap justify-center mt-2"><span>Nous te conseillons de rafraîchir la page !</span></div>
    </h1>
  </div>;
  } else if (!isLoaded) {

    /* Loader */

    return <div className='h-screen w-screen flex justify-center items-center bg-red-450 dark:bg-black xl:bg-white-0 xl:dark:bg-white-0'>
      <div className='flex justify-center items-center dark:hidden'>
        <Lottie options={defaultOptions2}
          height={500}
          width={500} className="" />
      </div>
      <div className='justify-center items-center hidden dark:flex'>
        <Lottie options={defaultOptions3}
          height={500}
          width={500} className="" />
      </div>
    </div>;
  } else {

    /* Constante pour gérer les filtres (désolé pour les noms) */

    const regexp = new RegExp(searchValue, 'i');
    const regexp_postal = new RegExp(filters.postal, 'i');
    const regexp_category = new RegExp(filters.category, 'i');
    const filterByName = items.filter(x => regexp.test(x.title));
    filterByFilters = items.filter(item => regexp_postal.test(item.postal));
    const filter100 = filterByFilters.filter(item => regexp_category.test(item.category))
    const filter1000 = filter100.filter(x => regexp.test(x.title));
    if (filters.filter_by === "upvote") {
      filter1000.sort(compareUpvote);
    } else if (filters.filter_by === "date") {
      filter1000.sort(compareDate);
    }

    return (
      <div className="h-screen w-screen  bg-white-0 dark:bg-gray-550 flex justify-center overflow-auto items-center">

        <div id="containerModal" className={openModal2 ? "block" : "hidden"}>
          <div id="modal" ref={modal2} className="flex w-screen h-screen bg-black bg-opacity-30 fixed bottom-0 left-0 justify-center z-40 items-end">

            <div className="w-full xl:w-2/6 h-90% xl:h-95% mb-10 xl:mb-0 relative flex flex-col justify-start items-center rounded-t-3xl bg-white-0 overflow-auto dark:bg-gray-550 dark:text-white-0">
              <div className="mb-5 mt-7 mx-3 flex flex-col">
                <div className="w-full h-250px relative">
                  <img className="object-cover rounded-t-lg h-full w-full" src={modalItem.image} alt="modale" />
                </div>
                {/* <h1 className="text-lg xl:text-xl font-semibold mx-2 max-w-md">{modalItem.image}</h1> */}
                <h1 className="text-lg xl:text-xl font-semibold max-w-md mt-2">{modalItem.title}</h1>
                <h1 className="text-base xl:text-lg px-4 max-w-max py-1 text-red-450 dark:text-white-0 rounded-full border-2 border-red-450 dark:border-white-0 font-semibold mt-4">{modalItem.category}</h1>

                <div className="flex w-92vw max-w-md mt-4">
                  <motion.img animate={{ y: ["-10%", "-40%"] }} transition={{ yoyo: Infinity, duration: 0.4, ease: "easeOut", repeatDelay: 1 }} id="loca" src={localisation} className="opacity-100 h-20px dark:hidden" alt="icon localisation"></motion.img>
                  <motion.img animate={{ y: ["-10%", "-40%"] }} transition={{ yoyo: Infinity, duration: 0.4, ease: "easeOut", repeatDelay: 1 }} id="loca" src={adresse} className="opacity-100 h-20px hidden dark:block" alt="icon localisation"></motion.img>
                  <div className='ml-6'>{modalItem.place}{", "}{modalItem.address}{", "}{modalItem.postal}</div>
                </div>

                <div className="flex mt-2 w-92vw max-w-md">
                  <motion.img animate={{ rotate: 180 }} transition={{ repeat: Infinity, duration: 0.4, ease: "easeOut", repeatDelay: 1 }} id="sablier" src={sablier} className="opacity-100 h-20px dark:hidden" alt="icon sablier"></motion.img>
                  <motion.img animate={{ rotate: 180 }} transition={{ repeat: Infinity, duration: 0.4, ease: "easeOut", repeatDelay: 1 }} id="sablier" src={sablierB} className="opacity-100 h-20px hidden dark:block" alt="icon sablier"></motion.img>
                  {modalItem.expiration !== '0000-00-00' ? <div className='ml-7'>{modalItem.expiration}</div> : <div className='ml-7'>A vie</div>}

                </div>

                <h1 className="text-sm xl:text-sm max-w-md mt-4">{modalItem.description}</h1>

                <div className='flex self-end items-center text-sm max-w-md mt-4'>
                  <Link to="/profil2" className='flex items-center'>
                  Posté par <span className="font-semibold cursor-pointer ml-1 mr-2" onClick={handleModal.bind(modalItem)}>{modalItem.user_pseudo}</span>
                  <img className="h-8 w-8 xl:border-2 cursor-pointer xl:h-8 xl:w-8 rounded-full xl:rounded-full border-2 border-red-450 dark:border-white-0" src={modalItem.file} alt="profil" /></Link>
                </div>

                <div className="flex w-full justify-evenly mt-5 mb-10">
                  <button onClick={() => setOpenModal2(false)} name='bouton fermer' className="block px-4 font-semibold py-2 bg-red-450 hover:bg-white-0 hover:text-red-450 hover:border-red-450 border-2 border-red-450 dark:hover:bg-white-150 dark:hover:text-gray-550 active:bg-red-200 dark:bg-white-0 dark:border-black dark:text-black rounded-full transition duration-300 ease-in-out text-white-0" type="submit">Fermer</button>

                </div>
              </div>
            </div>
          </div>
        </div>

        <ul className="h-full bg-white-0 xl:w-2/6 dark:bg-gray-550 relative top-10">
          <div className="xl:pl-5 xl:pr-5 mt-7 pb-24 xl:pb-10">
            <form className="post flex flex-col justify-center mb-3" onSubmit={(e) => handleSubmitFiltered(e)} id="filter_form">
              <div className="flex h-50px relative justify-center items-center w-full">
                <h1 className="text-center text-2xl font-bold dark:text-gray-50">Recherche</h1>
              </div>
              <div className="flex relative justify-center items-center mx-auto w-65% xl:hidden">
                <div className="flex items-center border-b-2 border-black dark:border-white-0 required:w-65% h-8 mt-2 mb-14">
                  <input value={searchValue} className=" required:w-65% px-6 bg-white-150 dark:bg-gray-550 placeholder-black dark:placeholder-white-0 focus:outline-none" placeholder="Rechercher par titre..." onChange={event => setSearchValue(event.target.value)} />
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 20 20" className="w-5 h-5 mt-1 mr-3 dark:hidden xl:hidden"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  <img src={Recherche} className='h-5 hidden dark:block xl:hidden'></img>
                </div>
              </div>

              <div id="containerModal" className={openModal ? " block" : "hidden"}>
                <div id="modal" ref={modal} className="flex w-screen h-screen bg-black bg-opacity-30 fixed bottom-0 left-0 justify-center z-40 items-end">
                  <div className="w-full xl:w-2/6 h-50% mb-10 xl:mb-0 relative  overflow-auto flex flex-col justify-start items-center rounded-t-3xl bg-white-0">
                    <div className="mb-5">
                      <h1 className="text-center text-2xl font-bold pt-7">Filtrer</h1>
                    </div>
                    <div className="mb-7">
                      <h2 className=" text-md pb-2 font-semibold ">Catégorie</h2>
                      <div className="flex  relative justify-center items-center mb-5">
                        {/* <label htmlFor="cat" className="">{filters.category}</label> */}
                        <select name="category" id="category" onChange={handleChange} className="block appearance-none w-full bg-white border-gray-400 hover:border-gray-500 px-4 py-2 pr-8  shadow leading-tight focus:outline-none focus:shadow-outline">
                          <option value="select">--Choisissez une catégorie--</option>
                          <option value="all">Toutes catégories</option>
                          <option value="Restos">Restos</option>
                          <option value="Expos">Expos</option>
                          <option value="Bars">Bars</option>
                          <option value="Soirées">Soirées</option>
                          <option value="Étudiants">Tarifs étudiants</option>
                          <option value="Autres">Autres</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                      </div>

                      <h2 className=" text-md pb-2 font-semibold ">Localisation</h2>
                      <div className="flex  relative justify-center items-center mb-5">
                        <label htmlFor="postal" className="">
                        </label>
                        <select name="postal" id="postal" onChange={handleChange} className="block appearance-none w-full bg-white border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 shadow leading-tight focus:outline-none focus:shadow-outline">
                          <option value="select">--Choisissez une région--</option>
                          <option value="all">Tous</option>
                          <option value="75">Paris</option>
                          <option value="77">Seine et Marne</option>
                          <option value="78">Yvellines</option>
                          <option value="91">Essonne</option>
                          <option value="92">Hauts-de-Seine</option>
                          <option value="93">Seine-Sant-Denis</option>
                          <option value="94">Val de Marne</option>
                          <option value="95">Val d'Oise</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                      </div>

                      {/* <h2 className=" text-md font-semibold ">Date d'expiration</h2>
                      <div className="flex  relative justify-center items-center mb-5">
                        <label htmlFor="expiration" className="text-black">
                        </label>
                        <input id="expiration"
                          type="date"
                          name="expiration"
                          maxLength="30"
                          placeholder="Date d'expiration" className="appearance-none placeholder-black text-black border-b-2 bg-transparent w-4/5 my-2 h-8 text-left focus:outline-none  focus:placeholder-transparent"
                          value={filters.expiration}
                          onChange={handleChange}
                        />
                      </div> */}

                      <h2 className=" text-md font-semibold ">Trier par</h2>
                      <div className="flex">
                        <div className="flex relative items-center mt-3 ml-3">
                          {/* <h4 className="text-black pl-2">{filters.filter_by}</h4> */}
                          <label htmlFor="certified" className="text-black">
                            <input id="filter_by_date"
                              type="radio"
                              name="filter_by"
                              maxLength="30"
                              className=""
                              value="upvote"
                              onChange={handleChange}
                            />
                            <span className="pl-2">Les plus populaires</span>
                          </label>
                        </div>
                        <div className="flex relative items-center mt-3 ml-3">
                          <label className="text-black pl-2">
                            <input id="filter_by_upvote"
                              type="radio"
                              name="filter_by"
                              maxLength="30"
                              className=""
                              value="date"
                              onChange={handleChange}
                            />
                            <span className="pl-2">Les plus récents</span>
                          </label>
                        </div>
                      </div>

                      {/* <div className="flex justify-end items-center py-5 mr-5">
                        <button name='bouton appliquer' className="block w-24 h-9 text-red-450 text-lg font-bold border-2 border-white-0 bg-white-0 hover:bg-red-450 hover:text-white-0 hover:border-white-0 dark:hover:bg-white-150 dark:hover:text-gray-550 active:bg-red-200 dark:bg-white-0 dark:text-black rounded-full transition duration-300 ease-in-out" type="submit">Appliquer</button>
                    </div>
                    <div className="flex justify-end items-center py-5 mr-5">
                        <button name='bouton réinitialiser' onClick={handleReset} className="block  h-9 text-red-450 text-lg font-bold border-2 border-white-0 bg-white-0 hover:bg-red-450 hover:text-white-0 hover:border-white-0 dark:hover:bg-white-150 dark:hover:text-gray-550 active:bg-red-200 dark:bg-white-0 dark:text-black rounded-full transition duration-300 ease-in-out">Réinitialiser</button>
                    </div> */}
                    </div>
                    <div className="flex w-full justify-evenly mt-5 mb-10">
                      <button onClick={handleReset} name='bouton annuler' className="block px-4 text-lg hover:underline hover:underline-offset-8 text-red-450 font-semibold dark:hover:underline dark:hover:underline-offset-8 dark:hover:text-black transition duration-300 ease-in-out">Annuler</button>
                      <button onClick={() => setOpenModal(false)} name='bouton appliquer' className="block px-5 py-2 text-white-0 text-lg font-semibold bg-red-450 hover:bg-white-0 hover:text-red-450 hover:border-red-450 border-2 border-red-450 dark:hover:bg-white-150 dark:hover:text-gray-550 active:bg-red-200 dark:bg-white-0 dark:text-black rounded-full transition duration-300 ease-in-out" type="submit">Appliquer</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* {openModal && <Modal closeModal={setOpenModal}/>} */}
            </form>
            {(filters.filtered ?

              filter1000.map(item => (
                <motion.div key={item.id_post} className="w-92vw h-150px relative flex justify-between items-center bg-red-450 xl:w-full dark:bg-black rounded-lg text-white-0 mb-5 shadow-customm"
                  whileHover={{ scale: 1.01 }}>
                  <div className="h-full w-35% flex justify-center items-center relative cursor-pointer">
                    <img className="w-90% h-90%  object-cover rounded-lg" src={item.image} alt="post" />
                  </div>
                  <div className="w-65% justify-self-end flex relative justify-center items-center h-full" onClick={handleModal.bind(item)}>
                    <li key={item.id_post} className="mt-1 w-92vw">
                      <div className="bg-white-0 text-black text-xl font-bold absolute right-3 top-3 w-max rounded-lg">
                        <span className="px-2 upvote">{item.upvote}</span>
                      </div>
                      <h1 className="text-base font-semibold mx-2">{item.title}</h1>
                      <div className="flex mt-2 text-sm">
                        <img src={adresse} className="ml-2 mr-1 w-3.5" alt='icon adresse'></img> {item.address} <div className="absolute right-3 bottom-3">{item.postal}</div>
                      </div>
                    </li>
                  </div>
                </motion.div>
              ))
              :
              filterByName.map(item => (
                <motion.div key={item.id_post} className="w-92vw h-150px relative flex justify-between items-center bg-red-450 xl:w-full dark:bg-black rounded-lg text-white-0 mb-5 shadow-customm"
                  whileHover={{ scale: 1.01 }} >
                  <div className="h-full w-35% flex justify-center items-center relative cursor-pointer">
                    <img className="w-90% h-90%  object-cover rounded-lg cursor-pointer" src={item.image} alt="post" />
                  </div>
                  <div className="w-65% justify-self-end flex relative justify-center items-center h-full cursor-pointer" onClick={handleModal.bind(item)}>
                    <li key={item.id_post} className="mt-1 w-92vw">
                      <div className="bg-white-0 text-black text-xl font-bold absolute right-3 top-3 w-max rounded-lg">
                        <span className="px-2 upvote">{item.upvote}</span>
                      </div>
                      <h1 className="text-base font-semibold mx-2">{item.title}</h1>
                      <div className="flex mt-2 text-sm">
                        <img src={adresse} className="ml-2 mr-1 w-3.5" alt='icon adresse'></img> {item.address} <div className="absolute right-3 bottom-3">{item.postal}</div>
                      </div>
                    </li>
                  </div>
                </motion.div>
              ))
            )}

          </div>
        </ul>
        <button name='bouton filtre' className="fixed bottom-24 xl:bottom-5 right-5 flex justify-center items-center w-16 h-16 text-lg font-bold  bg-orange-450 hover:bg-red-450 hover:text-white-0 hover:border-white-0 dark:hover:bg-white-150 dark:hover:text-gray-550 active:bg-red-200 dark:bg-white-0 dark:text-black rounded-full transition duration-300 ease-in-out shadow-customm"
          onClick={() => {
            setOpenModal(true);
          }}><img src={filtre} className="h-6 dark:hidden" alt="icon filtre"/><img src={filtreNoir} className="h-6 hidden dark:block" /></button>

      </div >
    );

  }
};

export default Filter;