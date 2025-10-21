import type { Component } from "solid-js";
import type { RouteSectionProps } from "@solidjs/router";
import Header from "./Header";
import Footer from "./Footer";

const Layout: Component<RouteSectionProps<unknown>> = (props) => {
    return (
        <div class="layout">
            <Header />
            <main class="h-screen overflow-auto">
                {props.children}
            </main>
            <Footer />
        </div>
    );
};
export default Layout;