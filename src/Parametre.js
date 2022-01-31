import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
const Parametre = () => {
    //DarkMode;
    const [theme, setTheme] = useState(localStorage.theme);
    const colorTheme = theme == "dark" ? "light" : 'dark';
    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove(colorTheme);
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme, colorTheme]);

    const checkboxLight = document.querySelector('#toggle_light_mode');
    const html = document.querySelector('html');
    const toggleDarkMode = function () {
        checkboxLight.checked ? html.classList.add("dark") : html.classList.remove("dark");
        toggleDarkMode();
        checkboxLight.addEventListener("click", toggleDarkMode);
    }

    
        // if (html.classList.contains("dark")) {
        //     checkboxLight.checked = true;
        //     console.log("ouuii");
        // } else {
        //     checkboxLight.checked = false;
        //     console.log("nooon");
        // }
        const [checked, setChecked] = React.useState(true);


    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen bg-gray-50 dark:text-white-0">
            <div id="infos" className="overflow-y-auto w-95vw h-full mt-20 xl:bg-gray-200 xl:w-1/3 xl:p-5 xl:mr-72 ">


                <h1 className="text-center text-2xl font-bold pt-7">Paramètres</h1>

                <h2 className=" text-xl pt-6 font-semibold ">Compte</h2>
                <li className='mt-2 list-none'>
                
                    <ul className="pb-2">
                        <Link to="/Infos">
                            <a className="cursor-pointer opacity-95 font-light">Informations du compte</a>
                        </Link>
                    </ul>
                    <ul className="pb-2"><a className="cursor-pointer opacity-95 font-light">Changer son mot de passe</a></ul>
                    <ul><a className="cursor-pointer opacity-95 font-light">Bons plans enregistrés</a></ul>
                </li>


                <h2 className="mt-2 text-xl pt-7 font-semibold ">Confidentialité</h2>
                <li className=' mt-2 list-none'>
               <ul> <Link to="/Bloque">
                    <a className="cursor-pointer opacity-95 font-light">Utilisateurs bloqués</a>
                    </Link></ul>
                </li>


                <h2 className="mt-2 text-xl pt-7 font-semibold">Affichage</h2>
                <li className=' mt-2 list-none'>
                    <ul className="w-full flex justify-between items-center opacity-95 font-light">Mode sombre
                        <input type="checkbox" onClick={() => setTheme(colorTheme)} id="toggle_light_mode" class="form-checkbox w-10 h-5 text-green-600 mr-2 rounded-full" checked={checked}
        onChange={() => setChecked(!checked)} ></input>
                    </ul>
                </li>


                <h2 className="mt-2 text-xl pt-7 font-semibold ">Notifications</h2>
                <li className='mt-2 list-none'>
                    <ul className="w-full flex justify-between items-center opacity-95 font-light pb-2">Messages privés
                        <input type="checkbox" class="form-checkbox w-10 h-5 text-green-600 mr-2 rounded-full" unchecked></input>
                    </ul>
                    <ul className="w-full flex justify-between items-center opacity-95 font-light pb-2">"UpVotes" sur un post publié
                        <input type="checkbox" class="form-checkbox w-10 h-5 text-green-600 mr-2 rounded-full" unchecked></input>
                    </ul>
                    <ul className="w-full flex justify-between items-center opacity-95 font-light">Autres
                    </ul>
                    
                </li>
                <h2 className="mt-2 p-0 text-base pt-10 font-semibold cursor-pointer ">Aide</h2>
                <h2 className="mt-2 text-base font-semibold cursor-pointer ">Déconnexion</h2>
                <h2 className="mt-2 text-base font-semibold text-red-500 cursor-pointer">Supprimer le compte</h2>
                
            </div>
        </div>
    )
}



export default Parametre

