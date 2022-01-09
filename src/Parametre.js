import React from 'react';
import { Link } from 'react-router-dom'
const Parametre = () => {

    return (


        <div className="flex flex-col justify-center items-center h-screen w-screen bg-white dark:text-white-0">
            <div id="infos" className="overflow-y-auto w-95vw h-full mt-20">


                <h1 className="text-center text-2xl font-bold pt-7">Paramètres</h1>

                <h2 className=" text-xl pt-6 font-semibold ">Compte</h2>
                <li className='mt-2 list-none'>
                <Link to="/Infos">
                    <ul className="pb-2"><a className="cursor-pointer opacity-95 font-light">Informations du compte</a></ul>
                </Link>
                    <ul className="pb-2"><a className="cursor-pointer opacity-95 font-light">Changer son mot de passe</a></ul>
                    <ul><a className="cursor-pointer opacity-95 font-light">Bons plans enregistrés</a></ul>
                </li>


                <h2 className="mt-2 text-xl pt-7 font-semibold ">Confidentialité</h2>
                <li className=' mt-2 list-none'>
                <Link to="/Bloque">
                    <ul><a className="cursor-pointer opacity-95 font-light">Utilisateurs bloqués</a></ul>
                    </Link>
                </li>


                <h2 className="mt-2 text-xl pt-7 font-semibold">Affichage</h2>
                <li className=' mt-2 list-none'>
                    <ul className="w-full flex justify-between items-center opacity-95 font-light">Mode sombre<input type="checkbox" class="form-checkbox w-10 h-5 text-green-600 mr-2 rounded-full" unchecked></input></ul>
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
                        <input type="checkbox" class="form-checkbox w-10 h-5 text-green-600 mr-2 rounded-full" unchecked></input>
                    </ul>
                </li>
                <h2 className="mt-2 text-base pt-10 font-semibold cursor-pointer ">Aide</h2>
                <h2 className="mt-2 text-base font-semibold cursor-pointer ">Déconnexion</h2>
                <h2 className="mt-2 text-base font-semibold text-red-500 cursor-pointer">Supprimer le compte</h2>
            </div>
        </div>
    )
}



export default Parametre

