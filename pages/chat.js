import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'

// Como fazer AJAX: https://medium.com/@omariosouto/entendendo-como-fazer-ajax-com-a-fetchapi-977ff20da3c6
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDg2OTA3MywiZXhwIjoxOTU2NDQ1MDczfQ.343ibq7UYFPDdyfsfGmEqUma01RW7P7KC9U2MDAGSkI';
const SUPABASE_URL = 'https://kysxypdmtxjlkdysdlas.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


export default function ChatPage() {
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                console.log('Dados da consulta:', data);
                setListaDeMensagens(data);
            });
    }, []);

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            // id: listaDeMensagens.length + 1,
            de: 'vanessametonini',
            texto: novaMensagem,
        };

        supabaseClient
            .from('mensagens')
            .insert([
                // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
                mensagem
            ])
            .then(({ data }) => {
                console.log('Criando mensagem: ', data);
                setListaDeMensagens([
                    data[0],
                    ...listaDeMensagens,
                ]);
            });

        setMensagem('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
                    height: "100%",
                    maxWidth: "95%",
                    maxHeight: "95vh",
                    padding: "32px",
                    backgroundColor: "rgba(0, 0, 0, 0.63)",
                    border: "2px solid rgba(255,101,80,1)",
                    borderColor: appConfig.theme.colors.neutrals[999],
                    borderRadius: "16px",
                    minHeight: "240px",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(2.6px)",
                    webkitBackdropFilter: "blur(2.6px)",
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: "relative",
                        display: "flex",
                        flex: 1,
                        height: "80%",
                        flexDirection: "column",
                        padding: "16px",
                        backgroundColor: "rgba(0, 0, 0, 0.63)",
                        border: "1px solid rgba(0, 0, 0, 0.88)",
                        borderColor: appConfig.theme.colors.primary[200],
                        borderRadius: "16px",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(2.6px)",
                        webkitBackdropFilter: "blur(2.6px)",
                    }}
                >
                    {loading ? (
                        <Box
                            styleSheet={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                            }}
                        >
                            <Bars
                                fill={appConfig.theme.colors.primary["900"]}
                                height="16px"
                            />
                        </Box>
                    ) : (
                        <MessageList chatMessages={chat} setChat={setChat} />
                    )}

                    <Box
                        as="form"
                        styleSheet={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMessage(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    handleNewMessage(message);
                                }
                            }}
                            placeholder="Digite a sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: "100%",
                                border: "0",
                                resize: "none",
                                borderRadius: "5px",
                                padding: "6px 8px",
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: "12px",
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                handleNewMessage(":sticker:" + sticker);
                            }}
                        />
                        <Button
                            variant="primary"
                            colorVariant="positive"
                            label="Enviar"
                            onClick={(event) => {
                                event.preventDefault();
                                handleNewMessage(message);
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

function Header() {
    return (
        <>
            <Box
                styleSheet={{
                    display: "flex",
                    width: "100%",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text
                    variant="heading5"
                    styleSheet={{
                        fontFamily: "Poppins",
                        fontSize: "20px",
                        color: appConfig.theme.colors.primary[200],
                    }}
                >
                    Isabellagouveias - Chat:
                </Text>
                <Button
                    variant="tertiary"
                    colorVariant="negative"
                    label="Logout"
                    href="/"
                />
            </Box>
        </>
    );
}

function MessageList(props) {
    function handleRemove(id) {
        const list = props.chatMessages.filter((mensagem) => mensagem.id !== id);
        props.setChat(list);
    }

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: "scroll",
                display: "flex",
                flexDirection: "column-reverse",
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: "16px",
                overflowX: "hidden",
            }}
        >
            {props.chatMessages.map((message) => {
                return (
                    <Text
                        tag="li"
                        key={message.id}
                        styleSheet={{
                            borderRadius: "5px",
                            padding: "6px",
                            marginBottom: "12px",
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            },
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: "8px",
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    marginRight: "8px",
                                }}
                                src={`https://github.com/${message.from}.png`}
                            />
                            <Text
                                tag="a"
                                href={`https://github.com/${message.from}`}
                                target="_blank"
                                styleSheet={{
                                    color: appConfig.theme.colors.neutrals[200],
                                    textDecoration: "none",
                                    hover: {
                                        color: appConfig.theme.colors.primary[500],
                                    },
                                }}
                            >
                                {message.from}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: "10px",
                                    marginLeft: "8px",
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {new Date(message.created_at).toLocaleString("pt-BR", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                })}
                            </Text>
                            <Icon
                                styleSheet={{
                                    width: "15px",
                                    height: "15px",
                                    marginLeft: "95%",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    marginRight: "8px",
                                    cursor: "pointer",
                                    hover: {
                                        backgroundColor: appConfig.theme.colors.neutrals[700],
                                    },
                                }}
                                onClick={() => {
                                    handleRemove(message.id);
                                }}
                                name="FaTrashAlt"
                                variant="tertiary"
                                colorVariant="neutral"
                            />
                        </Box>
                        {message.text.startsWith(":sticker:") ? (
                            <Image
                                src={message.text.replace(":sticker:", "")}
                                width="150"
                                height="150"
                            />
                        ) : (
                            message.text
                        )}
                    </Text>
                );
            })}
        </Box>
    );
}