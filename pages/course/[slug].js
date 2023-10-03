import * as contentful from "../../utils/contentful"
import {Accordion} from '@contentful/f36-components';
import {Box, Image} from '@chakra-ui/react'
import {useState} from "react";


export default function CoursePage({gradeGroup}) {

    const [accordionState, setAccordionState] = useState({});

    const handleExpand = (itemIndex) => () => {
        setAccordionState((state) => ({...state, [itemIndex]: true}));
    };

    const handleCollapse = (itemIndex) => () => {
        setAccordionState((state) => ({...state, [itemIndex]: false}));
    };
    console.log(gradeGroup)
    return (
        <>


            <Accordion align={"start"}>
                {Object.entries(gradeGroup).map(([key, value], index) => (
                    <Accordion.Item key={key}
                                    isExpanded={accordionState[index] == null ? true : accordionState[index]}
                                    onExpand={handleExpand(index)}
                                    onCollapse={handleCollapse(index)}
                                    title={
                                        <Box marginTop={30}>
                                            <h3 style={{
                                                display: 'inline',
                                                fontSize: '1.2em',
                                                marginRight: '10px'
                                            }}>{key}</h3>
                                            <h4 style={{
                                                display: 'inline',
                                                fontSize: '0.8em'
                                            }}>{value.length} Levels</h4>
                                        </Box>
                                    }>
                        <div key={key}>
                            <Box marginTop={10}>
                                <Accordion align={"start"}>
                                    {value.map((activitiesData) => (

                                            <Accordion.Item key={activitiesData} title={activitiesData[0].levelTitle}>
                                                {activitiesData.map((data) => (
                                                    <Box display={'inline-block'} key={data} maxW='sm' borderWidth='1px'
                                                         borderRadius='lg' overflow='hidden'
                                                    >
                                                        <Image
                                                            src={data.imageURL}
                                                            alt={'Image Not Found'}/>
                                                        <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight'
                                                             noOfLines={1}>
                                                            {data.activityTitle}
                                                        </Box>
                                                    </Box>
                                                ))
                                                }
                                            </Accordion.Item>
                                        )
                                    )}
                                </Accordion>
                            </Box>
                        </div>
                    </Accordion.Item>
                ))}
            </Accordion>

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
