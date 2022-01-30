import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import OutlinedCard from '../../src/components/NoteCard';

const Note = ({ notes }: { notes: any }):React.ReactElement => {
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
                {notes.map((note: any, index: number) => (
                    <OutlinedCard key={index} heading={note.heading} body={note.body} tags={note.tags} createdAt={note.meta.date} />
                ))}
            </Box>
        </Container>
    );
};

export async function getServerSideProps(context: any) {
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

export default Note;
