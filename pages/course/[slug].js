import * as contentful from "../../utils/contentful"
import {Accordion} from '@contentful/f36-components';
import {Box, Image} from '@chakra-ui/react'


export default function CoursePage({gradeGroup}) {
    console.log(gradeGroup)
    return (
        <>
            <div>name of the course is <h3></h3></div>
            {Object.entries(gradeGroup).map(([key, value]) => (
                <div key={key}>
                    <Accordion align={"start"}>
                        <h3>{key}</h3>
                        {value.map((activitiesData) => (
                                <Accordion.Item key={activitiesData} title={activitiesData[0].levelTitle}>
                                    {activitiesData.map((data)=> (
                                        <Box display={'inline-block'} key={data} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'
                                        >
                                            <Image
                                                src={data.imageURL}
                                                alt={'Image Not Found'}/>
                                            <Box  mt='1' fontWeight='semibold' as='h4' lineHeight='tight' noOfLines={1}>
                                                {data.activityTitle}
                                            </Box>
                                        </Box>
                                    ) )
                                    }
                                </Accordion.Item>
                            )
                        )}
                    </Accordion>
                </div>

            ))}
        </>
    )
}


async function getActivityDataFromLevel(level) {
    let pathwayActivityIds = level.fields.pathwayActivities.map((it => it.sys.id));
    //TODO : improve here making separate call for each id
    let activity = []
    await Promise.all(pathwayActivityIds.map(async (it) => {
            const pathwayActivity = await contentful.previewClient.getEntry(it);
            activity.push(pathwayActivity.fields.activity)
        })
    )
    return activity.map((it) => {
        return {
            levelTitle: level.fields.title,
            imageURL: it.fields.image.fields.file.url,
            activityTitle: it.fields.title
        }
    })
}


export async function getServerSideProps(context) {

    let code = context.params;
    const course = await contentful.previewClient
        .getEntries({
            content_type: 'course',
            limit: 1,
            "fields.code": code,
        })
    const levels = course.items[0].fields.levels;

    //Group by grade levels
    let gradeGroup = await levels.reduce(async (groupPromise, level) => {
        const group = await groupPromise;
        let gradeLevels = level.fields.gradeLevel;

        for (const it of gradeLevels) {
            if (group[it] == null) {
                group[it] = [];
            }
            group[it].push(await getActivityDataFromLevel(level));
        }

        return group;
    }, Promise.resolve({}));
    return (
        {
            props: {
                gradeGroup
            }
        }
    )
}
