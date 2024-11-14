import path from 'path';
import fs from 'fs';
import resourceTypesData from "./resource-type-identifiers.json";
import regionsData from "./regions.json";
import { CFResourceType } from '../models/cloudformationResourceType';

const cloudformationResourceSpecificationsDir = path.join(__dirname, "resources", "cloudformation-resource-specifications");

const combineRegionsWithResources = () => {
    const combinedData: Record<string, any> = {};

    const filteredRegionsData = regionsData.map(({ SingleFileUrl, AllFilesUrl, ...rest}) => rest);

    for (const region of filteredRegionsData) {
        const filePath = path.join(cloudformationResourceSpecificationsDir, `${region.Region}.json`)

        if (fs.existsSync(filePath)) {
            const resourceSpec = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            combinedData[region.Region] = { ...region, resourceSpec: resourceSpec };
        } else {
            console.warn(`Resource specification for region "${region.Region}" not found.`);
        }
    }
    return combinedData
}

export const getResourceTypeDefinition = (region: string, resourceType: CFResourceType) => {
    const regionData = regionsData.find(x => x.Region === region);
    if (!regionData) {
        throw new Error(`Cannot find any region with identifier ${region}.`)
    }
    const resourceTypeData = resourceTypesData.find(x => x["ResourceTypeIdentifier"] === resourceType);
    if (!resourceTypeData) {
        throw new Error(`Cannot find any resource with type ${resourceType}`)
    }

    const resourceTypeSplit = resourceType.split("::");

    const resourceSpecificationFilename = resourceTypeSplit[1] + resourceTypeSplit[2] + "Specification.json";

    const resourceSpecificationForRegionFile = path.join(cloudformationResourceSpecificationsDir, `${regionData.Region}`, resourceSpecificationFilename);

    if (!fs.existsSync(resourceSpecificationForRegionFile)) {
        throw new Error(`Cannot find any resource specification file ${resourceSpecificationFilename} for region ${regionData.Region} in ${resourceSpecificationForRegionFile}`);
    }

    const resourceSpec = JSON.parse(fs.readFileSync(resourceSpecificationForRegionFile, 'utf-8'));

    return {
        ...resourceTypeData,
        specification: resourceSpec
    }
};