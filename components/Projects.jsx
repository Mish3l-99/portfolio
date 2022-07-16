import React, { useEffect, useState } from "react";
import { BsArrowReturnRight } from "react-icons/bs";

import Project from "./Project";

import sociaImg from "../public/assets/projects/socia.png";
import travelImg from "../public/assets/projects/travel.png";
import aptiveImg from "../public/assets/projects/aptive.png";
import defiImg from "../public/assets/projects/defi.png";
import dataImg from "../public/assets/projects/data.png";
import brandImg from "../public/assets/projects/brand.png";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../firebase";

const Projects = () => {
  const [projects, setProjects] = useState();
  useEffect(() => {
    const projectsQ = query(collection(db, "projects"), limit(6));
    getDocs(projectsQ).then((data) => {
      setProjects(data.docs.map((doc) => ({ id: doc.id })));
    });
  }, []);
  if (!projects) {
    return <p>Loading...</p>;
  }

  return (
    <section id="projects">
      <div className="container">
        <h3 className="text-meshaal uppercase">Projects</h3>
        <div className="flex space-x-2">
          <span className="text-[25px] md:text-[30px]">
            <BsArrowReturnRight />
          </span>
          <h1 className="mb-4">What I&#39;ve done</h1>
        </div>

        {/* projects grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <Project key={i} id={p.id} />
          ))}
          {/* grid item
          <Project
            title="Travel"
            backgroundImg={travelImg}
            projectUrl="/blah"
            githubRepo="blahblah"
          />
          <Project
            title="Socia"
            backgroundImg={sociaImg}
            projectUrl="/blah"
            githubRepo="blahblah"
          />
          <Project
            title="Defi"
            backgroundImg={defiImg}
            projectUrl="/blah"
            githubRepo="blahblah"
          />
          <Project
            title="Data"
            backgroundImg={dataImg}
            projectUrl="/blah"
            githubRepo="blahblah"
          />
          <Project
            title="Brand"
            backgroundImg={brandImg}
            projectUrl="/blah"
            githubRepo="blahblah"
          />
          <Project
            title="Aptive"
            backgroundImg={aptiveImg}
            projectUrl="/blah"
            githubRepo="blahblah"
          /> */}
        </div>
      </div>
    </section>
  );
};

export default Projects;
