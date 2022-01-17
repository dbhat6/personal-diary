import * as React from 'react';
import type { NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '../../src/Link';
import OutlinedCard from '../../src/components/NoteCard';
import { useRouter } from 'next/router'

const About: NextPage = ({ notes }) => {
    const router = useRouter()
    const { noteId } = router.query

    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                {notes.map(note => (
                    <OutlinedCard heading={note.heading} body={note.body} tags={note.tags} createdAt={note.meta.date} />
                ))}
            </Box>
        </Container>
    );
};

export async function getServerSideProps(context) {
    const { noteId } = context.params
    // Call an external API endpoint to get notes
    const res = await fetch(`http://localhost:3000/api/notes/${noteId}`)
    const notes = await res.json()

    // By returning { props: { notes } }, the Blog component
    // will receive `notes` as a prop at build time
    return {
        props: {
            notes,
        },
    }
}

export default About;
