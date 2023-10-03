import * as contentful from "../../utils/contentful"
import {Accordion} from '@contentful/f36-components';
import {Box, Image} from '@chakra-ui/react'
import {useState} from "react";


export default function CoursePage({gradeGroup,courseName}) {

    const setOfLevel = new Set();
    Object.values(gradeGroup).flat().flat().map((it)=>{
        setOfLevel.add(it.levelTitle)
    })

    const [accordionState, setAccordionState] = useState({});

    const handleExpand = (itemIndex) => () => {
        setAccordionState((state) => ({...state, [itemIndex]: true}));
    };

    const handleCollapse = (itemIndex) => () => {
        setAccordionState((state) => ({...state, [itemIndex]: false}));
    };

    return (
        <>
            <div >
                <div style={{ marginLeft: '10px', display: 'inline-block' }}>
                    <h2>{courseName}</h2>
                </div>
                <div style={{ marginLeft: '5px', display: 'inline-block' }}>({setOfLevel.size})</div>
            </div>
            <Box marginTop={60}><Accordion align={"start"}>
                {Object.entries(gradeGroup).map(([key, value], index) => (
                    <Accordion.Item key={key}
                                    isExpanded={accordionState[index] == null ? true : accordionState[index]}
                                    onExpand={handleExpand(index)}
                                    onCollapse={handleCollapse(index)}
                                    title={
                                        <Box marginTop={30}>
                                            <div style={{
                                                display: 'inline',
                                                fontSize: '1.3em',
                                                marginRight: '10px'
                                            }}>{key}</div>
                                            <div style={{
                                                display: 'inline',
                                                fontSize: '0.8em'
                                            }}>{value.length} Levels
                                            </div>
                                        </Box>
                                    }>
                        <div key={key}>
                            <Box marginTop={10}>
                                <Accordion align={"start"}>
                                    {value.map((activitiesData) => (
                                            <Accordion.Item key={activitiesData} title={activitiesData[0].levelTitle}>
                                                {activitiesData.map((data) => (
                                                    <Box display={'inline-block'} key={data} maxW='sm' borderWidth='1px'
                                                         borderRadius='lg' overflow='hidden' margin='0 20px' _hover={{
                                                        border: "1px solid blue", // Border style on hover
                                                    }}
                                                    >
                                                        <Image
                                                            src={data.imageURL}
                                                            alt={'Image Not Found'}/>
                                                        <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight'
                                                        >
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
            </Accordion></Box>
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
                gradeGroup,
                courseName:course.items[0].fields.name
            }
        }
    )
}
