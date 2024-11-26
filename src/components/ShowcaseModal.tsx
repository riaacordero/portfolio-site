"use client";

import { cn } from "~/utils";
import { useStore } from "@nanostores/react";
import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import { Dialog, Modal } from "react-aria-components";
import { currentProjectId } from "~/store";

import { asHTML, asLink, asText } from "@prismicio/client";
import { ProjectsDocumentData } from "~/prismic.d";

import siteLogo from "~/assets/logo.png";
import showcaseModalClasses from "./ShowcaseModal.module.css";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import Button from "./Button";

function SliderNavigation() {
  const swiper = useSwiper();

  const [slidesLength, setSlidesLength] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getCurrentState = () => {
    setCurrentIndex(swiper.realIndex);
    setSlidesLength(swiper.slides.length);
  };

  useEffect(() => {
    getCurrentState();
  }, []);

  useEffect(() => {
    swiper.on("slideChange", getCurrentState);
    return () => {
      swiper.off("slideChange", getCurrentState);
    };
  }, [swiper]);

  if (slidesLength === 1) {
    return <></>;
  }

  return (
    <div className="w-auto space-x-2 flex items-center">
      <button
        onClick={() => {
          swiper.slidePrev();
          setCurrentIndex(swiper.realIndex);
        }}
        className="shadow border dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zink-900 text-gray-600 dark:text-white transition-colors rounded-full h-10 w-10 p-1.5 flex m-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="m10.8 12l3.9 3.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.212-.325T8.425 12t.063-.375t.212-.325l4.6-4.6q.275-.275.7-.275t.7.275t.275.7t-.275.7z"
          ></path>
        </svg>
      </button>

      <div className="shadow border dark:border-zinc-700 bg-white dark:bg-zinc-800 h-10 flex-1 flex py-1.5 px-4 rounded-full items-center space-x-1 justify-center">
        {[...Array(slidesLength).keys()].map((idx) => (
          <div
            key={`slide_${idx}`}
            className={cn("h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-600", {
              "bg-zinc-600 dark:bg-zinc-300": idx === currentIndex,
            })}
          ></div>
        ))}
      </div>

      <button
        onClick={() => {
          swiper.slideNext();
          setCurrentIndex(swiper.realIndex);
        }}
        className="shadow border dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zink-900 text-gray-600 dark:text-white transition-colors rounded-full h-10 w-10 p-1.5 flex m-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12.6 12L8 7.4L9.4 6l6 6l-6 6L8 16.6z"
          ></path>
        </svg>
      </button>
    </div>
  );
}

export default function ShowcaseModal() {
  const $currentProjectId = useStore(currentProjectId);
  const prev = useRef($currentProjectId);

  const { data: project, isLoading } = useSWR(
    $currentProjectId ? { projectId: $currentProjectId } : null,
    async ({ projectId }) => {
      const response = await fetch(`/projects/${projectId}.json`);
      const json = await response.json();
      return json.data as ProjectsDocumentData;
    },
    {},
  );

  const handleClose = () => {
    currentProjectId.set(null);
  };

  useEffect(() => {
    if (localStorage.getItem("project-id")) {
      currentProjectId.set(localStorage.getItem("project-id"));
      localStorage.removeItem("project-id");
    }
  }, []);

  useEffect(() => {
    if (prev.current === $currentProjectId) return;

    if ($currentProjectId) {
      window.history.pushState(null, "", `/projects/${$currentProjectId}`);
    } else {
      // go back to the previous page
      window.history.back();
    }

    prev.current = $currentProjectId;
  }, [$currentProjectId]);

  return (
    <Modal
      isDismissable
      isKeyboardDismissDisabled
      isOpen={$currentProjectId !== null}
      onOpenChange={(open) => {
        if (!open) {
          return handleClose();
        }
      }}
      className="fixed inset-0 bg-white dark:bg-zinc-800 bg-opacity-50 flex flex-col items-center pt-6 pb-12 px-4 lg:px-0 backdrop-blur-sm overflow-y-auto"
    >
      <Dialog className="max-w-5xl w-full outline-none">
        <div className="card border-rainbow flex flex-col p-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-[2px]">
          <button
            onClick={handleClose}
            className="z-10 sticky w-max ml-auto top-0 right-0 -translate-x-4 translate-y-2 lg:translate-y-4 shadow rounded-full border dark:border-zinc-700 dark:hover:border-pink-700 p-3 hover:border-[#ff3d9a] dark:hover:bg-pink-900 bg-white dark:bg-zinc-800 dark:text-white hover:bg-pink-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex flex-col -mt-12">
            {project && !isLoading ? (
              <div className="relative mx-auto w-full">
                {project.images.length > 0 && (
                  <div>
                    <Swiper
                      spaceBetween={50}
                      loop
                      className="rounded-t-[1.2rem] relative"
                    >
                      {project.images.map(({ image }) => (
                        <SwiperSlide key={`image_${image.url}`}>
                          <div
                            className={cn(
                              showcaseModalClasses.image,
                              "w-full aspect-[756/491] bg-gray-100 bg-cover bg-center bg-no-repeat shadow-lg shadow-pink-400/20",
                            )}
                            style={{
                              backgroundImage: `url(${image.url})`,
                            }}
                          ></div>
                        </SwiperSlide>
                      ))}

                      <span
                        slot="container-end"
                        className="z-20 w-full absolute bottom-0"
                      >
                        <div className="flex justify-center pb-4">
                          <SliderNavigation />
                        </div>
                      </span>
                    </Swiper>
                  </div>
                )}

                <div className="max-w-2xl mx-auto w-full py-8 px-6">
                  <p
                    className={cn(
                      "uppercase text-gray-400 dark:text-zinc-100 md:text-lg",
                    )}
                  >
                    {project.type}
                  </p>
                  <h2 className="text-2xl dark:text-white font-bold">
                    {asText(project.name)}
                  </h2>

                  <div className="py-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-stretch md:items-center">
                    {asLink(project.website_link) && (
                      <Button
                        as="a"
                        href={asLink(project.website_link)}
                        className="w-full md:flex-1 font-semibold"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2s.06-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.92 7.92 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8 8 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.7 15.7 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"
                          ></path>
                        </svg>
                        <span>Website Link</span>
                      </Button>
                    )}

                    {asLink(project.project_link) && (
                      <Button
                        as="a"
                        href={asLink(project.project_link)}
                        className="w-full md:flex-1 font-semibold"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="1em"
                          height="1em"
                          className="text-2xl"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeDasharray="28"
                            strokeDashoffset="28"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 6l2 -2c1 -1 3 -1 4 0l1 1c1 1 1 3 0 4l-5 5c-1 1 -3 1 -4 0M11 18l-2 2c-1 1 -3 1 -4 0l-1 -1c-1 -1 -1 -3 0 -4l5 -5c1 -1 3 -1 4 0"
                          >
                            <animate
                              fill="freeze"
                              attributeName="stroke-dashoffset"
                              dur="0.6s"
                              values="28;0"
                            ></animate>
                          </path>
                        </svg>
                        <span>Project Link</span>
                      </Button>
                    )}
                  </div>

                  <div
                    className="text-gray-500 dark:text-zinc-100"
                    dangerouslySetInnerHTML={{
                      __html: asHTML(project.description),
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 h-[60vh]">
                <img
                  src={siteLogo.src}
                  alt="Logo"
                  className="w-32 h-32 animate-pulse"
                />
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </Modal>
  );
}
