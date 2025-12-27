import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { client, urlFor } from '../client';
import { fetchUser } from '../utils/fetchUser';

const getSafeUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const navigate = useNavigate();
  const user = fetchUser();

  const alreadySaved = save?.some(
    (item) => item.postedBy?._id === user?.sub
  );

  const savePin = (id) => {
    if (alreadySaved) return;

    client
      .patch(id)
      .setIfMissing({ save: [] })
      .insert('after', 'save[-1]', [
        {
          _key: uuidv4(),
          userId: user?.sub,
          postedBy: {
            _type: 'postedBy',
            _ref: user?.sub,
          },
        },
      ])
      .commit()
      .then(() => window.location.reload());
  };

  const deletePin = (id) => {
    client.delete(id).then(() => window.location.reload());
  };

  return (
    <div className="m-2">

      {/* IMAGE — ONLY CLICKABLE AREA */}
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in hover:shadow-lg overflow-hidden rounded-lg"
      >
        <img
          src={urlFor(image).width(250).url()}
          alt="pin"
          className="w-full rounded-lg"
        />

        {postHovered && (
          <div className="absolute inset-0 flex flex-col justify-between p-2 bg-black/40">

            {/* TOP ACTIONS */}
            <div className="flex justify-between">
              <a
                href={`${image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center opacity-80 hover:opacity-100"
              >
                <MdDownloadForOffline />
              </a>

              {alreadySaved ? (
                <span className="bg-red-500 text-white px-4 py-1 rounded-3xl text-sm">
                  {save?.length} Saved
                </span>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  className="bg-red-500 text-white px-4 py-1 rounded-3xl text-sm"
                >
                  Save
                </button>
              )}
            </div>

            {/* BOTTOM ACTIONS */}
            <div className="flex justify-between items-center gap-2">
              {destination && (
                <a
                  href={getSafeUrl(destination)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold opacity-80 hover:opacity-100"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 15
                    ? `${destination.slice(0, 15)}...`
                    : destination}
                </a>
              )}

              {postedBy?._id === user?.sub && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="bg-white p-2 rounded-full opacity-80 hover:opacity-100"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* USER PROFILE — SEPARATE NAVIGATION */}
      <Link
        to={`/user-profile/${postedBy?._id}`}
        className="flex items-center gap-2 mt-2"
      >
        <img
          src={postedBy?.image}
          alt="user"
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="font-medium capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
