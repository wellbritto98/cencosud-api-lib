import React from "react";
import { ProjectApi, UpdateProjectDto, ReadProjectDto } from "../shared/apiSwaggerGen/api";
import { api } from "../shared/api";
import DetailGeneric from "../components/GenericDetail";


const ProjectDetail = () => {
  const projectApi = new ProjectApi(undefined, '', api);

  const fetchProjectDetails = (id: number) => projectApi.apiProjectGetGet(id);
  const updateProject = async (id: number, data: UpdateProjectDto): Promise<void> => {
    await projectApi.apiProjectUpdatePut(id, data); // Ignore o retorno do AxiosResponse
  };  
  const fetchRelatedApis = (id: number) => projectApi.apiProjectGetApiInstancesGet(id);

  return (
    <DetailGeneric<ReadProjectDto, UpdateProjectDto>
      title="Detalhes do Projeto"
      fetchEntityDetails={fetchProjectDetails}
      updateEntity={updateProject}
      fetchRelatedItems={fetchRelatedApis}
      relatedItemsTitle="APIs Relacionadas"
      entityFields={{ name: "name", description: "description", status: "status" }}
      entityName="Projeto"
    />
  );
};

export default ProjectDetail;
