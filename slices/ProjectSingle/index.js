import Image from "next/image";
import React from "react";

const ProjectSingle = ({ slice }) => {
    return (
        <section className="mx-8">
            <figure className="py-4">
                <Image src={slice.primary.image.url} width={slice.primary.image.dimensions.width} height={slice.primary.image.dimensions.height} />
                <ficaption>
                    <p className="text-lg">
                        {slice.primary.project.data.title}
                        {slice.primary.project.tags.map((tag, index) => (
                            <span className="ml-2 text-gray-400" key={index}>{tag}</span>
                        ))}
                    </p>
                </ficaption>
            </figure>
        </section>
    )
};

export default ProjectSingle;
