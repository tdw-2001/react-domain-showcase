import React from 'react';
import { InfoBox } from '../App';

const MobilePreviewView: React.FC = () => (
    <div className="flex flex-col items-center">
        <div className="w-80 h-[640px] bg-black rounded-3xl p-3 border-4 border-gray-700 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-lg"></div>
            <div className="h-full w-full overflow-y-auto mt-2 pr-1 text-sm bg-brand-bg-dark">
                <div className="p-3 space-y-3">
                    <h4 className="font-bold text-white">Dashboard Preview</h4>
                    <div className="bg-brand-bg-light p-2 rounded">
                        <p className="font-semibold mb-1 text-gray-200">Tasks</p>
                        <p className="text-xs text-gray-500 line-through">Review Q2 analytics</p>
                        <p className="text-xs text-gray-300">Generate blog post draft</p>
                    </div>
                    <div className="bg-brand-bg-light p-2 rounded">
                        <p className="font-semibold mb-1 text-gray-200">Team Chat</p>
                        <p className="text-xs text-green-400">Alice: Updates pushed.</p>
                        <p className="text-xs text-purple-400">Bob: Reviewing now.</p>
                    </div>
                </div>
            </div>
        </div>
        <InfoBox>This is a web-based simulation of the dashboard's responsive UI, built with the same React components.</InfoBox>
    </div>
);

export default MobilePreviewView;
